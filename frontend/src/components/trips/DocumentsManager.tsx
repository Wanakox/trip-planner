import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useRef, useState } from 'react'

import { deleteTripFile, getTripFiles, uploadTripFiles } from '../../api/trips'
import type { TripDetails, TripFile } from '../../types/trip'

function formatSize(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / 1024 / 1024).toFixed(1)} MB`
}

function uploadErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) return 'No se han podido subir los documentos.'
  if (!error.response) return 'No se puede conectar con el servidor.'
  if (error.response.status === 401) return 'Tu sesión ha caducado. Inicia sesión de nuevo.'
  const detail = error.response.data?.detail
  if (typeof detail === 'string') {
    if (detail.includes('more than 10 files')) return 'El viaje no puede contener más de 10 documentos.'
    if (detail.includes('completed trips')) return 'Los documentos solo están disponibles en viajes completados.'
    if (detail.includes('could not be stored')) return 'El servidor no ha podido almacenar los documentos.'
  }
  return 'No se han podido subir los documentos.'
}

export function DocumentsManager({
  tripId,
  tripCompleted,
  initialFiles,
}: {
  tripId: number
  tripCompleted: boolean
  initialFiles: TripFile[]
}) {
  const queryClient = useQueryClient()
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState(initialFiles)
  const [toDelete, setToDelete] = useState<TripFile | null>(null)
  const [selectionError, setSelectionError] = useState<string | null>(null)

  const sync = (next: TripFile[]) => {
    setFiles(next)
    queryClient.setQueryData(
      ['trip-details', tripId],
      (current: TripDetails | undefined) => current ? { ...current, files: next } : current,
    )
  }

  const refresh = async () => sync(await getTripFiles(tripId))

  const uploadMutation = useMutation({
    mutationFn: (selectedFiles: File[]) => uploadTripFiles(tripId, selectedFiles),
    onSuccess: async () => {
      await refresh()
      if (inputRef.current) inputRef.current.value = ''
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (fileId: number) => deleteTripFile(tripId, fileId),
    onSuccess: async () => {
      await refresh()
      setToDelete(null)
    },
  })

  const selectFiles = (selected: FileList | null) => {
    if (!selected?.length) return
    const next = Array.from(selected)
    setSelectionError(null)
    uploadMutation.reset()
    if (files.length + next.length > 10) {
      setSelectionError(`Solo puedes añadir ${10 - files.length} documento(s) más.`)
      if (inputRef.current) inputRef.current.value = ''
      return
    }
    uploadMutation.mutate(next)
  }

  return (
    <Paper variant="outlined" sx={{ p: 2.25, borderRadius: '18px', borderColor: '#dce3ec' }}>
      <Stack direction="row" sx={{ mb: 1.5, gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography component="h2" sx={{ fontSize: 16, fontWeight: 800 }}>Documentos</Typography>
        <Button component="label" size="small" startIcon={<AddIcon />} disabled={!tripCompleted || uploadMutation.isPending || files.length >= 10} sx={{ minHeight: 32 }}>
          {uploadMutation.isPending ? 'Subiendo...' : 'Subir'}
          <input ref={inputRef} hidden type="file" multiple onChange={(event) => selectFiles(event.target.files)} />
        </Button>
      </Stack>

      {!tripCompleted && <Alert severity="info">Los documentos estarán disponibles cuando el viaje esté completado.</Alert>}
      {(selectionError || uploadMutation.isError || deleteMutation.isError) && <Alert severity="error" sx={{ mb: 2 }}>{selectionError || (uploadMutation.isError ? uploadErrorMessage(uploadMutation.error) : 'No se ha podido eliminar el documento.')}</Alert>}
      {uploadMutation.isPending && <LinearProgress sx={{ mb: 2 }} />}

      {tripCompleted && <Stack spacing={1}>
        {files.map((file) => (
          <Stack key={file.id} direction="row" spacing={1.25} sx={{ p: 1, bgcolor: '#f7f9fc', borderRadius: '10px', alignItems: 'center' }}>
            <DescriptionOutlinedIcon color="primary" />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography noWrap title={`${file.name}.${file.extension}`} sx={{ fontSize: 12, fontWeight: 700 }}>{file.name}.{file.extension}</Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 11 }}>{formatSize(file.size)}</Typography>
            </Box>
            <IconButton size="small" color="error" aria-label={`Eliminar ${file.name}`} onClick={() => { deleteMutation.reset(); setToDelete(file) }}><DeleteOutlineIcon fontSize="small" /></IconButton>
          </Stack>
        ))}
        {!files.length && <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>No hay documentos guardados.</Typography>}
        <Typography sx={{ color: 'text.secondary', fontSize: 11 }}>{files.length}/10 documentos</Typography>
      </Stack>}

      <Dialog open={Boolean(toDelete)} onClose={() => !deleteMutation.isPending && setToDelete(null)} fullWidth maxWidth="xs">
        <DialogTitle>Eliminar documento</DialogTitle>
        <DialogContent><DialogContentText>¿Quieres eliminar «{toDelete?.name}.{toDelete?.extension}»? Esta acción no se puede deshacer.</DialogContentText></DialogContent>
        <DialogActions><Button onClick={() => setToDelete(null)} disabled={deleteMutation.isPending}>Cancelar</Button><Button color="error" variant="contained" disabled={deleteMutation.isPending} onClick={() => { if (toDelete) deleteMutation.mutate(toDelete.id) }}>{deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}</Button></DialogActions>
      </Dialog>
    </Paper>
  )
}
