import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined'
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'

import { addNote, deleteNote, getTripNotes, updateNote } from '../../api/trips'
import type { NotePayload, TripDetails, TripNote } from '../../types/trip'

function errorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) return 'No se ha podido guardar la nota.'
  if (!error.response) return 'No se puede conectar con el servidor.'
  if (error.response.status === 401) return 'Tu sesión ha caducado. Inicia sesión de nuevo.'
  const detail = error.response.data?.detail
  if (typeof detail === 'string') {
    if (detail.includes('already exists')) return 'Ya existe una nota asociada a ese día.'
    if (detail.includes('maximum number')) return 'El viaje ha alcanzado el número máximo de notas.'
    if (detail.includes('within the trip duration')) return 'El día seleccionado no pertenece al viaje.'
    if (detail.includes('completed trips')) return 'Las notas solo están disponibles en viajes completados.'
  }
  return 'No se ha podido guardar la nota. Revisa los datos.'
}

export function NotesManager({
  tripId,
  totalDays,
  tripCompleted,
  initialNotes,
}: {
  tripId: number
  totalDays: number
  tripCompleted: boolean
  initialNotes: TripNote[]
}) {
  const queryClient = useQueryClient()
  const [notes, setNotes] = useState(initialNotes)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<TripNote | null>(null)
  const [toDelete, setToDelete] = useState<TripNote | null>(null)
  const [form, setForm] = useState<NotePayload>({ title: '', text: '', day_number: null })

  const sync = (next: TripNote[]) => {
    const sorted = next.slice().sort((a, b) =>
      (a.day_number ?? Number.MAX_SAFE_INTEGER) - (b.day_number ?? Number.MAX_SAFE_INTEGER) || a.id - b.id,
    )
    setNotes(sorted)
    queryClient.setQueryData(
      ['trip-details', tripId],
      (current: TripDetails | undefined) => current ? { ...current, notes: sorted } : current,
    )
  }

  const refresh = async () => sync(await getTripNotes(tripId))

  const saveMutation = useMutation({
    mutationFn: (payload: NotePayload) => editing
      ? updateNote(tripId, editing.id, payload)
      : addNote(tripId, payload),
    onSuccess: async () => {
      await refresh()
      setFormOpen(false)
    },
  })
  const deleteMutation = useMutation({
    mutationFn: (noteId: number) => deleteNote(tripId, noteId),
    onSuccess: async () => {
      await refresh()
      setToDelete(null)
    },
  })

  const openCreate = () => {
    setEditing(null)
    setForm({ title: '', text: '', day_number: null })
    saveMutation.reset()
    setFormOpen(true)
  }
  const openEdit = (note: TripNote) => {
    setEditing(note)
    setForm({ title: note.title, text: note.text, day_number: note.day_number })
    saveMutation.reset()
    setFormOpen(true)
  }

  return (
    <Paper variant="outlined" sx={{ p: 2.25, borderRadius: '18px', borderColor: '#dce3ec' }}>
      <Stack direction="row" sx={{ mb: 1.5, gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography component="h2" sx={{ fontSize: 16, fontWeight: 800 }}>Notas</Typography>
        <Button size="small" startIcon={<AddIcon />} onClick={openCreate} disabled={!tripCompleted || notes.length >= totalDays} sx={{ minHeight: 32 }}>Añadir</Button>
      </Stack>

      {!tripCompleted && <Alert severity="info">Las notas estarán disponibles cuando el viaje esté completado.</Alert>}
      {deleteMutation.isError && <Alert severity="error" sx={{ mb: 2 }}>No se ha podido eliminar la nota.</Alert>}

      {tripCompleted && <Stack spacing={1.25}>
        {notes.map((note) => (
          <Stack key={note.id} direction="row" spacing={1} sx={{ p: 1.25, alignItems: 'flex-start', bgcolor: '#fffbea', borderRadius: '12px' }}>
            <NotesOutlinedIcon sx={{ mt: 0.25, color: 'warning.dark' }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography sx={{ fontSize: 13, fontWeight: 800 }}>{note.title}</Typography>
                {note.day_number && <Chip label={`Día ${note.day_number}`} size="small" color="warning" variant="outlined" sx={{ height: 21 }} />}
              </Stack>
              <Typography sx={{ mt: 0.5, color: 'text.secondary', fontSize: 12, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{note.text}</Typography>
            </Box>
            <IconButton size="small" aria-label={`Editar ${note.title}`} onClick={() => openEdit(note)}><EditOutlinedIcon fontSize="small" /></IconButton>
            <IconButton size="small" color="error" aria-label={`Eliminar ${note.title}`} onClick={() => { deleteMutation.reset(); setToDelete(note) }}><DeleteOutlineIcon fontSize="small" /></IconButton>
          </Stack>
        ))}
        {!notes.length && <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>No hay notas registradas.</Typography>}
      </Stack>}

      <Dialog open={formOpen} onClose={() => !saveMutation.isPending && setFormOpen(false)} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={(event) => { event.preventDefault(); saveMutation.mutate({ ...form, title: form.title.trim(), text: form.text.trim() }) }}>
          <DialogTitle>{editing ? 'Editar nota' : 'Añadir nota'}</DialogTitle>
          <DialogContent>
            {saveMutation.isError && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage(saveMutation.error)}</Alert>}
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField label="Título" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required slotProps={{ htmlInput: { maxLength: 150 } }} />
              <TextField label="Texto" value={form.text} onChange={(event) => setForm((current) => ({ ...current, text: event.target.value }))} required multiline minRows={4} />
              <TextField select label="Día del viaje (opcional)" value={form.day_number ?? ''} onChange={(event) => setForm((current) => ({ ...current, day_number: event.target.value === '' ? null : Number(event.target.value) }))}>
                <MenuItem value="">Sin día concreto</MenuItem>
                {Array.from({ length: totalDays }, (_, index) => index + 1).map((day) => <MenuItem key={day} value={day} disabled={notes.some((note) => note.day_number === day && note.id !== editing?.id)}>Día {day}</MenuItem>)}
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions><Button onClick={() => setFormOpen(false)} disabled={saveMutation.isPending}>Cancelar</Button><Button type="submit" variant="contained" disabled={saveMutation.isPending}>{saveMutation.isPending ? 'Guardando...' : 'Guardar nota'}</Button></DialogActions>
        </Box>
      </Dialog>

      <Dialog open={Boolean(toDelete)} onClose={() => !deleteMutation.isPending && setToDelete(null)} fullWidth maxWidth="xs">
        <DialogTitle>Eliminar nota</DialogTitle>
        <DialogContent><DialogContentText>¿Quieres eliminar la nota «{toDelete?.title}»?</DialogContentText></DialogContent>
        <DialogActions><Button onClick={() => setToDelete(null)} disabled={deleteMutation.isPending}>Cancelar</Button><Button color="error" variant="contained" disabled={deleteMutation.isPending} onClick={() => { if (toDelete) deleteMutation.mutate(toDelete.id) }}>{deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}</Button></DialogActions>
      </Dialog>
    </Paper>
  )
}
