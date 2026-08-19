import { Route, Routes } from 'react-router-dom'

import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<HomePage />} path="/" />
      <Route element={<RegisterPage />} path="/registro" />
      <Route element={<LoginPage />} path="/iniciar-sesion" />
    </Routes>
  )
}
