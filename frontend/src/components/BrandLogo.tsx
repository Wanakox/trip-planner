import { Box, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

type BrandLogoProps = {
  inverse?: boolean
}

export function BrandLogo({ inverse = false }: BrandLogoProps) {
  return (
    <Stack
      component={RouterLink}
      direction="row"
      spacing={1.5}
      to="/"
      sx={{
        alignItems: 'center',
        color: inverse ? 'white' : 'text.primary',
        textDecoration: 'none',
      }}
    >
      <Box sx={{ width: 40, height: 40, borderRadius: '12px', bgcolor: inverse ? 'white' : 'primary.main', color: inverse ? 'primary.main' : 'white', display: 'grid', placeItems: 'center', fontSize: 22, fontWeight: 800 }}>
        ✦
      </Box>
      <Typography
        sx={{
          fontSize: 22,
          fontWeight: 800,
        }}
      >
        TripPlanner
      </Typography>
    </Stack>
  )
}
