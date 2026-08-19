import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'

import { getHealth } from '../api/health'

export function HomePage() {
  const healthQuery = useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
    retry: false,
  })

  return (
    <Container maxWidth="md">
      <Stack
        component="main"
        spacing={3}
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
        }}
      >
        <Typography component="h1" variant="h2">
          TripPlanner
        </Typography>

        <Typography color="text.secondary" variant="h6">
          Aplicación web para la gestión y planificación de viajes
        </Typography>

        {healthQuery.isPending && <CircularProgress />}

        {healthQuery.isSuccess && (
          <Alert severity="success">
            Backend y base de datos conectados
          </Alert>
        )}

        {healthQuery.isError && (
          <Alert severity="error">
            No se ha podido conectar con el backend
          </Alert>
        )}

        <Button variant="contained">
          Comenzar
        </Button>
      </Stack>
    </Container>
  )
}