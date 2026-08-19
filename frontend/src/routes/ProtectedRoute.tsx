import {
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom'

export function ProtectedRoute() {
  const location = useLocation()

  const accessToken =
    localStorage.getItem('access_token')

  if (!accessToken) {
    return (
      <Navigate
        to="/iniciar-sesion"
        replace
        state={{
          from: location.pathname,
        }}
      />
    )
  }

  return <Outlet />
}