import { useParams } from 'react-router-dom'

import { DemoPage } from '../components/layout/DemoPage'

export function TripDetailsPage() {
  const { tripId } = useParams()

  return (
    <DemoPage
      title="Detalles del viaje"
      description={`Vista provisional del viaje ${tripId ?? ''}.`}
    />
  )
}