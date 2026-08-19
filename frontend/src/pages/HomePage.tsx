import {
  AppBar,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import { BrandLogo } from '../components/BrandLogo'

const features = [
  {
    number: '01',
    title: 'Itinerario inteligente',
    body: 'Organiza destinos, actividades y horarios por día.',
    color: '#115bca',
  },
  {
    number: '02',
    title: 'Gastos bajo control',
    body: 'Controla el presupuesto y reparte gastos entre participantes.',
    color: '#067f56',
  },
  {
    number: '03',
    title: 'Documentación segura',
    body: 'Guarda reservas, notas y archivos importantes.',
    color: '#f97316',
  },
]

export function HomePage() {
  return (
    <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'background.paper' }}>
      <AppBar color="inherit" elevation={0} position="static" sx={{ borderBottom: '1px solid #dce3ec' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: '88px !important' }}>
            <BrandLogo />
            <Stack direction="row" spacing={1.5} sx={{ ml: 'auto' }}>
              <Button component={RouterLink} to="/iniciar-sesion" variant="outlined" color="inherit">
                Iniciar sesión
              </Button>
              <Button component={RouterLink} to="/registro" variant="contained">
                Registrarse
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Box sx={{ bgcolor: 'background.default', py: { xs: 7, md: 10 } }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.08fr 0.92fr' }, gap: { xs: 7, md: 10 }, alignItems: 'center' }}>
            <Box>
              <Typography color="primary" fontSize={14} fontWeight={700} letterSpacing={0.3}>
                TU VIAJE, TODO EN UN MISMO LUGAR
              </Typography>
              <Typography component="h1" sx={{ mt: 2, maxWidth: 650, fontSize: { xs: 40, sm: 50, md: 58 }, lineHeight: 1.1, fontWeight: 800, letterSpacing: -1.5 }}>
                Planifica cada momento. Disfruta todo el viaje.
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 3, maxWidth: 610, fontSize: 18, lineHeight: 1.65 }}>
                Organiza itinerarios, reservas, gastos y documentos sin perderte entre aplicaciones. TripPlanner convierte tus planes en un viaje claro y compartido.
              </Typography>
              <Button component={RouterLink} to="/registro" variant="contained" size="large" sx={{ mt: 4, px: 3 }}>
                Crear mi primer viaje
              </Button>
            </Box>

            <Box sx={{ bgcolor: 'primary.light', borderRadius: '28px', p: { xs: 3, sm: 5 }, minHeight: 390, display: 'flex', alignItems: 'center' }}>
              <Paper elevation={0} sx={{ position: 'relative', width: '100%', height: 260, borderRadius: '22px', p: 3 }}>
                <Stack direction="row" justifyContent="space-between" fontWeight={600} fontSize={14}>
                  <span>Madrid</span><span>Atenas</span>
                </Stack>
                <Box sx={{ mt: 6, mx: 3, height: 8, bgcolor: 'primary.main', borderRadius: 4, position: 'relative' }}>
                  <Box sx={{ position: 'absolute', width: 40, height: 40, borderRadius: '50%', bgcolor: 'secondary.main', left: -20, top: -16 }} />
                  <Box sx={{ position: 'absolute', width: 40, height: 40, borderRadius: '50%', bgcolor: '#f97316', right: -20, top: -16 }} />
                </Box>
                <Paper sx={{ position: 'absolute', left: '10%', right: '10%', bottom: -55, bgcolor: 'text.primary', color: 'white', borderRadius: '18px', p: 3 }}>
                  <Typography color="#dbecff" fontSize={13}>Próximo viaje</Typography>
                  <Typography fontSize={23} fontWeight={700}>Creta · 7 días</Typography>
                  <Typography color="#dbecff" fontSize={14}>12–19 de septiembre</Typography>
                </Paper>
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 7 }}>
        <Typography component="h2" fontSize={30} fontWeight={800}>
          Todo lo que necesitas para viajar tranquilo
        </Typography>
        <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {features.map((feature) => (
            <Paper key={feature.number} variant="outlined" sx={{ borderColor: '#dce3ec', borderRadius: '18px', p: 3, minHeight: 170 }}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box sx={{ bgcolor: feature.color, color: 'white', borderRadius: '12px', minWidth: 44, height: 44, display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 700 }}>
                  {feature.number}
                </Box>
                <Box>
                  <Typography fontSize={18} fontWeight={700}>{feature.title}</Typography>
                  <Typography color="text.secondary" fontSize={14} lineHeight={1.6} sx={{ mt: 1 }}>{feature.body}</Typography>
                </Box>
              </Stack>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  )
}
