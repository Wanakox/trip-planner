import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import BedOutlinedIcon from '@mui/icons-material/BedOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import DirectionsBusOutlinedIcon from '@mui/icons-material/DirectionsBusOutlined'
import DownloadIcon from '@mui/icons-material/Download'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined'
import FlightOutlinedIcon from '@mui/icons-material/FlightOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'

import { downloadTripExport, getTripDetails } from '../api/trips'
import type {
  TripActivity,
  TripExpense,
  TripStatus,
} from '../types/trip'

const statusConfig: Record<
  TripStatus,
  { label: string; color: 'primary' | 'warning' | 'success' | 'error' }
> = {
  planning: { label: 'Planificando', color: 'primary' },
  in_progress: { label: 'En curso', color: 'warning' },
  completed: { label: 'Completado', color: 'success' },
  cancelled: { label: 'Cancelado', color: 'error' },
}

const categoryLabels: Record<string, string> = {
  accommodation: 'Alojamiento',
  transport: 'Transporte',
  food: 'Comidas',
  leisure: 'Ocio',
  shopping: 'Compras',
  other: 'Varios',
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))
}

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(value)
}

function SectionCard({
  title,
  action,
  children,
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Paper
      variant="outlined"
      sx={{ p: 2.25, borderRadius: '18px', borderColor: '#dce3ec' }}
    >
      <Stack
        direction="row"
        sx={{
          mb: 1.5,
          gap: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography component="h2" sx={{ fontSize: 16, fontWeight: 800 }}>
          {title}
        </Typography>
        {action}
      </Stack>
      {children}
    </Paper>
  )
}

function ActivityCard({ activity }: { activity: TripActivity }) {
  return (
    <Paper
      variant="outlined"
      sx={{ p: 2, borderRadius: '16px', borderColor: '#dce3ec' }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ gap: 1, alignItems: { sm: 'center' } }}
      >
        <Chip
          label={`DÍA ${activity.day_number}`}
          size="small"
          color="primary"
          sx={{ alignSelf: 'flex-start', fontSize: 10, fontWeight: 800 }}
        />
        <Typography sx={{ flex: 1, fontWeight: 750 }}>
          {activity.name}
        </Typography>
        {activity.start_time && (
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ alignItems: 'center', color: 'text.secondary' }}
          >
            <AccessTimeIcon sx={{ fontSize: 16 }} />
            <Typography sx={{ fontSize: 12 }}>
              {activity.start_time.slice(0, 5)}
            </Typography>
          </Stack>
        )}
      </Stack>
      {activity.location && (
        <Stack
          direction="row"
          spacing={0.5}
          sx={{ mt: 1, alignItems: 'center', color: 'text.secondary' }}
        >
          <LocationOnOutlinedIcon sx={{ fontSize: 16 }} />
          <Typography sx={{ fontSize: 13 }}>{activity.location}</Typography>
        </Stack>
      )}
    </Paper>
  )
}

function ExpensesCard({
  expenses,
  budget,
  currency,
}: {
  expenses: TripExpense[]
  budget: number
  currency: string
}) {
  const categories = useMemo(
    () =>
      expenses.reduce<Record<string, number>>((result, expense) => {
        result[expense.category] =
          (result[expense.category] ?? 0) + Number(expense.amount)
        return result
      }, {}),
    [expenses],
  )
  const total = Object.values(categories).reduce(
    (sum, amount) => sum + amount,
    0,
  )

  return (
    <SectionCard
      title="Gastos detallados"
      action={
        <Chip
          size="small"
          color="primary"
          variant="outlined"
          label={`Presupuesto: ${formatMoney(budget, currency)}`}
        />
      }
    >
      <Stack spacing={1.5}>
        {Object.entries(categories).map(([category, amount]) => (
          <Box key={category}>
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: 13 }}>
                {categoryLabels[category] ?? category}
              </Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                {formatMoney(amount, currency)}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={total ? Math.min((amount / total) * 100, 100) : 0}
              sx={{ mt: 0.5, height: 4, borderRadius: 4 }}
            />
          </Box>
        ))}
        {!expenses.length && (
          <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>
            Todavía no hay gastos registrados.
          </Typography>
        )}
        <Divider />
        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
          <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>
            Total gastado
          </Typography>
          <Typography sx={{ fontWeight: 800 }}>
            {formatMoney(total, currency)} / {formatMoney(budget, currency)}
          </Typography>
        </Stack>
      </Stack>
    </SectionCard>
  )
}

export function TripDetailsPage() {
  const { tripId } = useParams()
  const numericTripId = Number(tripId)
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState(false)
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['trip-details', numericTripId],
    queryFn: () => getTripDetails(numericTripId),
    enabled: Number.isInteger(numericTripId) && numericTripId > 0,
  })

  const handleExport = async () => {
    if (!data) return
    setExporting(true)
    setExportError(false)
    try {
      const blob = await downloadTripExport(data.trip.id)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${data.trip.name}.zip`
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      setExportError(true)
    } finally {
      setExporting(false)
    }
  }

  if (!Number.isInteger(numericTripId) || numericTripId < 1) {
    return <Alert severity="error">El identificador del viaje no es válido.</Alert>
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100dvh',
        px: { xs: 2, sm: 3, md: 5, lg: 6 },
        pt: { xs: 10, md: 5 },
        pb: 5,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto' }}>
        {isLoading && (
          <Box sx={{ minHeight: 500, display: 'grid', placeItems: 'center' }}>
            <CircularProgress />
          </Box>
        )}
        {isError && (
          <Alert
            severity="error"
            action={<Button color="inherit" onClick={() => refetch()}>Reintentar</Button>}
          >
            No se ha podido cargar el viaje. Comprueba la conexión e inténtalo de nuevo.
          </Alert>
        )}

        {data && (
          <>
            <Button
              component={RouterLink}
              to="/viajes"
              startIcon={<ArrowBackIcon />}
              sx={{ mb: 1, color: 'text.secondary' }}
            >
              Mis viajes
            </Button>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              sx={{
                gap: 2,
                alignItems: { sm: 'flex-start' },
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Stack
                  direction="row"
                  spacing={1.25}
                  sx={{ alignItems: 'center', flexWrap: 'wrap' }}
                >
                  <Typography
                    component="h1"
                    sx={{
                      fontSize: { xs: 30, md: 38 },
                      lineHeight: 1.1,
                      fontWeight: 850,
                      letterSpacing: -0.8,
                    }}
                  >
                    {data.trip.name}
                  </Typography>
                  <Chip
                    size="small"
                    variant="outlined"
                    color={statusConfig[data.trip.status].color}
                    label={statusConfig[data.trip.status].label}
                  />
                </Stack>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    mt: 1,
                    color: 'text.secondary',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <Typography sx={{ fontSize: 13 }}>
                    Origen: {data.trip.origin}
                  </Typography>
                  <Typography>•</Typography>
                  <Typography sx={{ fontSize: 13 }}>
                    {data.trip.destinations
                      .slice()
                      .sort((a, b) => a.order - b.order)
                      .map((destination) => destination.city)
                      .join(' · ')}
                  </Typography>
                  <Typography>•</Typography>
                  <Typography sx={{ fontSize: 13 }}>
                    {formatDate(data.trip.start_date)} - {formatDate(data.trip.end_date)} ({data.trip.total_days} días)
                  </Typography>
                </Stack>
              </Box>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleExport}
                  disabled={exporting || data.trip.status !== 'completed'}
                >
                  {exporting ? 'Exportando...' : 'Exportar'}
                </Button>
                <Button variant="contained" startIcon={<EditOutlinedIcon />}>
                  Editar viaje
                </Button>
              </Stack>
            </Stack>

            {exportError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                No se ha podido exportar el viaje.
              </Alert>
            )}
            {data.trip.description && (
              <Typography
                sx={{
                  mt: 2,
                  maxWidth: 1000,
                  color: 'text.secondary',
                  lineHeight: 1.6,
                }}
              >
                {data.trip.description}
              </Typography>
            )}

            <Box
              sx={{
                mt: 3.5,
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  lg: 'minmax(0, 1.65fr) minmax(320px, .9fr)',
                },
                gap: 2.5,
                alignItems: 'start',
              }}
            >
              <Box>
                <Typography
                  component="h2"
                  sx={{ mb: 1.5, fontSize: 19, fontWeight: 850 }}
                >
                  Itinerario diario
                </Typography>
                <Stack spacing={1.5}>
                  {data.activities
                    .slice()
                    .sort((a, b) => a.day_number - b.day_number || a.order - b.order)
                    .map((activity) => (
                      <ActivityCard key={activity.id} activity={activity} />
                    ))}
                  {!data.activities.length && (
                    <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
                      <EventNoteOutlinedIcon color="disabled" />
                      <Typography sx={{ color: 'text.secondary' }}>
                        Aún no hay actividades en este viaje.
                      </Typography>
                    </Paper>
                  )}
                </Stack>
              </Box>

              <Stack spacing={2}>
                <SectionCard title="Tareas pendientes">
                  <Stack spacing={0.25}>
                    {data.tasks.map((task) => (
                      <Stack
                        key={task.id}
                        direction="row"
                        sx={{ alignItems: 'center' }}
                      >
                        <Checkbox size="small" checked={task.completed} disabled />
                        <Typography
                          sx={{
                            fontSize: 13,
                            color: task.completed ? 'text.secondary' : 'text.primary',
                            textDecoration: task.completed ? 'line-through' : 'none',
                          }}
                        >
                          {task.name}
                        </Typography>
                      </Stack>
                    ))}
                    {!data.tasks.length && (
                      <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>
                        No hay tareas pendientes.
                      </Typography>
                    )}
                  </Stack>
                </SectionCard>

                <ExpensesCard
                  expenses={data.expenses}
                  budget={Number(data.trip.budget)}
                  currency={data.trip.currency}
                />

                <SectionCard title="Transporte">
                  <Stack spacing={1.5}>
                    {data.transports.map((transport) => (
                      <Stack key={transport.id} direction="row" spacing={1.5}>
                        <Avatar
                          variant="rounded"
                          sx={{ bgcolor: 'primary.light', color: 'primary.main' }}
                        >
                          {transport.transport_type === 'flight' ? (
                            <FlightOutlinedIcon />
                          ) : (
                            <DirectionsBusOutlinedIcon />
                          )}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontSize: 13, fontWeight: 750 }}>
                            {transport.origin} → {transport.destination}
                          </Typography>
                          <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>
                            {formatDate(transport.departure_date)}
                            {transport.departure_time
                              ? ` · ${transport.departure_time.slice(0, 5)}`
                              : ''}
                          </Typography>
                        </Box>
                      </Stack>
                    ))}
                    {!data.transports.length && (
                      <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>
                        No hay transportes registrados.
                      </Typography>
                    )}
                  </Stack>
                </SectionCard>

                <SectionCard title="Alojamiento">
                  <Stack spacing={1.5}>
                    {data.accommodations.map((accommodation) => (
                      <Stack key={accommodation.id} direction="row" spacing={1.5}>
                        <Avatar
                          variant="rounded"
                          sx={{ bgcolor: '#e2f7ef', color: 'secondary.main' }}
                        >
                          <BedOutlinedIcon />
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontSize: 13, fontWeight: 750 }}>
                            {accommodation.name}
                          </Typography>
                          <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>
                            {accommodation.address}
                          </Typography>
                          <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>
                            Check-in: {formatDate(accommodation.check_in_date)} · Check-out: {formatDate(accommodation.check_out_date)}
                          </Typography>
                        </Box>
                      </Stack>
                    ))}
                    {!data.accommodations.length && (
                      <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>
                        No hay alojamientos registrados.
                      </Typography>
                    )}
                  </Stack>
                </SectionCard>

                <SectionCard
                  title="Documentos y reservas"
                  action={<Button size="small" sx={{ minHeight: 32 }}>+ Añadir</Button>}
                >
                  <Stack spacing={1}>
                    {data.files.map((file) => (
                      <Stack
                        key={file.id}
                        direction="row"
                        spacing={1.25}
                        sx={{
                          p: 1,
                          bgcolor: '#f7f9fc',
                          borderRadius: '10px',
                          alignItems: 'center',
                        }}
                      >
                        <DescriptionOutlinedIcon color="primary" />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography noWrap sx={{ fontSize: 12, fontWeight: 700 }}>
                            {file.name}.{file.extension}
                          </Typography>
                          <Typography sx={{ color: 'text.secondary', fontSize: 11 }}>
                            {(file.size / 1024 / 1024).toFixed(1)} MB
                          </Typography>
                        </Box>
                      </Stack>
                    ))}
                    {!data.files.length && (
                      <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>
                        {data.trip.status === 'completed'
                          ? 'No hay documentos guardados.'
                          : 'Los documentos estarán disponibles cuando el viaje esté completado.'}
                      </Typography>
                    )}
                  </Stack>
                </SectionCard>
              </Stack>
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}
