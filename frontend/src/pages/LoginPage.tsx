import { useState } from 'react'
import { Alert, Box, Button, Link, Stack, TextField } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

import { loginUser } from '../api/auth'
import { AuthCard } from '../components/AuthCard'
import { BrandLogo } from '../components/BrandLogo'

export function LoginPage() {
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const mutation = useMutation({
    mutationFn: () => loginUser(identifier, password),
    onSuccess: (tokens) => {
      localStorage.setItem('access_token', tokens.access_token)
      localStorage.setItem('refresh_token', tokens.refresh_token)
      navigate('/')
    },
  })

  return (
    <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'background.default', p: { xs: 3, sm: 6 } }}>
      <BrandLogo />
      <Box sx={{ minHeight: { md: 'calc(100vh - 136px)' }, display: 'grid', placeItems: 'center', py: 6 }}>
        <AuthCard title="Bienvenido de nuevo" subtitle="Accede a tus viajes, reservas y planes.">
          <Stack component="form" spacing={3} onSubmit={(event) => { event.preventDefault(); mutation.mutate() }}>
            {mutation.isError && <Alert severity="error">El correo, usuario o contraseña no son correctos.</Alert>}
            <TextField label="Correo electrónico o usuario" value={identifier} onChange={(event) => setIdentifier(event.target.value)} required autoComplete="username" />
            <TextField label="Contraseña" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required inputProps={{ minLength: 8 }} autoComplete="current-password" />
            <Button disabled={mutation.isPending} type="submit" variant="contained" size="large" sx={{ mt: 2 }}>
              {mutation.isPending ? 'Iniciando sesión…' : 'Iniciar sesión'}
            </Button>
            <Link component={RouterLink} to="/registro" color="text.secondary" textAlign="center" underline="hover">
              ¿No tienes cuenta? <Box component="span" color="primary.main" fontWeight={600}>Regístrate gratis</Box>
            </Link>
          </Stack>
        </AuthCard>
      </Box>
    </Box>
  )
}
