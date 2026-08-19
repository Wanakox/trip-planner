export type TripStatus =
  | 'planning'
  | 'in_progress'
  | 'completed'
  | 'cancelled'

export type Destination = {
  id: number
  country: string
  city: string
  currency: string
  order: number
}

export type Trip = {
  id: number
  user_id: number
  name: string
  origin: string
  description: string | null
  start_date: string
  end_date: string
  total_days: number
  budget: string
  currency: string
  status: TripStatus
  rating: number | null
  destinations: Destination[]
}

export type DestinationCreatePayload = {
  country: string
  city: string
  currency: string
}

export type TripCreatePayload = {
  name: string
  origin: string
  description: string | null
  start_date: string
  end_date: string
  budget: number
  destinations: DestinationCreatePayload[]
}