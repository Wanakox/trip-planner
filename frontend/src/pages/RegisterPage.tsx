import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Alert, Box, Button, Link, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

import { registerUser } from '../api/auth'
import { AuthCard } from '../components/AuthCard'
import { BrandLogo } from '../components/BrandLogo'

const initialForm = { name: '', surname: '', username: '', email: '', password: '', confirmPassword: '', defaultCurrency: 'EUR' }

export function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [formError, setFormError] = useState('')
  const update = (field: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) => setForm((current) => ({ ...current, [field]: event.target.value }))
  const mutation = useMutation({
    mutationFn: () => registerUser({ name: form.name, surname: form.surname, username: form.username, email: form.email, password: form.password, default_currency: form.defaultCurrency }),
    onSuccess: () => navigate('/iniciar-sesion'),
  })

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (form.password !== form.confirmPassword) {
      setFormError('Las contraseñas no coinciden.')
      return
    }
    setFormError('')
    mutation.mutate()
  }

  return (
    <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '41% 59%' } }}>
      <Box sx={{ bgcolor: 'primary.main', color: 'white', p: { xs: 4, sm: 7 }, display: { xs: 'none', md: 'block' } }}>
        <BrandLogo inverse />
        <Typography component="h1" sx={{ mt: 12, maxWidth: 440, fontSize: 42, lineHeight: 1.23, fontWeight: 800 }}>Empieza con tu primer viaje. Más fácil que nunca.</Typography>
        <Typography color="#dbecff" fontSize={17} lineHeight={1.65} sx={{ mt: 2, maxWidth: 430 }}>Reúne itinerario, presupuesto y reservas en un espacio diseñado para disfrutar más y preocuparte menos.</Typography>
        <Paper elevation={0} sx={{ mt: 7, borderRadius: '24px', p: 4, maxWidth: 462 }}>
          <Typography color="primary" fontSize={12} fontWeight={700}>PRÓXIMO VIAJE</Typography>
          <Typography fontSize={26} fontWeight={800} sx={{ mt: 1 }}>Aventura por Creta</Typography>
          <Typography color="text.secondary" fontSize={13} sx={{ mt: 2 }}>⌖ Heraclión · Matalá · Chania, Grecia</Typography>
          <Typography color="text.secondary" fontSize={12} fontWeight={600} sx={{ mt: 2 }}>▣ 12–19 SEP 2026 · 7 días</Typography>
          <Typography color="text.secondary" fontSize={13} sx={{ mt: 2 }}><b>Presupuesto:</b> 1.350€</Typography>
        </Paper>
      </Box>
      <Box sx={{ p: { xs: 3, sm: 5 }, display: 'grid', placeItems: 'center' }}>
        <Box sx={{ display: { xs: 'block', md: 'none' }, justifySelf: 'start', width: '100%', mb: 3 }}><BrandLogo /></Box>
        <AuthCard title="Crea tu cuenta" subtitle="Empieza a organizar tu próximo viaje en minutos.">
          <Stack component="form" spacing={2.2} onSubmit={submit}>
            {(formError || mutation.isError) && <Alert severity="error">{formError || 'No se ha podido crear la cuenta. Revisa los datos o prueba con otro correo y usuario.'}</Alert>}
            <TextField label="Nombre" value={form.name} onChange={update('name')} required autoComplete="given-name" />
            <TextField label="Apellido" value={form.surname} onChange={update('surname')} required autoComplete="family-name" />
            <TextField label="Nombre de usuario" value={form.username} onChange={update('username')} required inputProps={{ minLength: 3, pattern: '[a-zA-Z0-9_.-]+' }} autoComplete="username" />
            <TextField label="Correo electrónico" type="email" value={form.email} onChange={update('email')} required autoComplete="email" />
            <TextField label="Contraseña" type="password" value={form.password} onChange={update('password')} required inputProps={{ minLength: 8 }} autoComplete="new-password" />
            <TextField label="Confirmar contraseña" type="password" value={form.confirmPassword} onChange={update('confirmPassword')} required inputProps={{ minLength: 8 }} autoComplete="new-password" />
            <TextField select label="Moneda predeterminada" value={form.defaultCurrency} onChange={update('defaultCurrency')}>
              {['EUR', 'USD', 'GBP'].map((currency) => <MenuItem key={currency} value={currency}>{currency}</MenuItem>)}
            </TextField>
            <Button disabled={mutation.isPending} type="submit" variant="contained" size="large">{mutation.isPending ? 'Creando cuenta…' : 'Crear cuenta'}</Button>
            <Link component={RouterLink} to="/iniciar-sesion" color="text.secondary" textAlign="center" underline="hover">¿Ya tienes una cuenta? <Box component="span" color="primary.main" fontWeight={600}>Inicia sesión</Box></Link>
          </Stack>
        </AuthCard>
      </Box>
    </Box>
  )
}
