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

export type TripActivity = {
  id: number
  trip_id: number
  name: string
  location: string | null
  start_time: string | null
  day_number: number
  completed: boolean
  order: number
}

export type TripTask = {
  id: number
  trip_id: number
  name: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  order: number
}

export type TripExpense = {
  id: number
  trip_id: number
  participant_id: number
  name: string
  amount: string
  category:
    | 'accommodation'
    | 'transport'
    | 'food'
    | 'leisure'
    | 'shopping'
    | 'other'
  currency: string
  expense_date: string
}

export type TripTransport = {
  id: number
  trip_id: number
  transport_type:
    | 'flight'
    | 'train'
    | 'bus'
    | 'car'
    | 'boat'
    | 'other'
  price: string | null
  departure_date: string
  arrival_date: string | null
  departure_time: string | null
  arrival_time: string | null
  origin: string
  destination: string
}

export type TripAccommodation = {
  id: number
  trip_id: number
  name: string
  address: string
  price: string | null
  check_in_date: string
  check_out_date: string
  check_in_time: string | null
  check_out_time: string | null
}

export type TripFile = {
  id: number
  trip_id: number
  name: string
  extension: string
  size: number
}

export type TripDetails = {
  trip: Trip
  activities: TripActivity[]
  tasks: TripTask[]
  expenses: TripExpense[]
  transports: TripTransport[]
  accommodations: TripAccommodation[]
  files: TripFile[]
}
