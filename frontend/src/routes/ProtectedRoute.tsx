import {
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom'

import {
  clearStoredSession,
  hasValidAccessToken,
} from '../utils/authSession'

export function ProtectedRoute() {
  const location = useLocation()

  if (!hasValidAccessToken()) {
    clearStoredSession()

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
