import { Route, Routes } from 'react-router-dom'

import { HomePage } from '../pages/HomePage'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<HomePage />} path="/" />
    </Routes>
  )
}