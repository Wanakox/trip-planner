import type {
  Trip,
  TripCreatePayload,
  TripDetails,
} from '../types/trip'
import { httpClient } from './http'

export async function getTrips(): Promise<Trip[]> {
  const { data } =
    await httpClient.get<Trip[]>('/trips')

  return data
}

export async function createTrip(
  payload: TripCreatePayload,
): Promise<Trip> {
  const { data } =
    await httpClient.post<Trip>(
      '/trips',
      payload,
    )

  return data
}

export async function getTripDetails(
  tripId: number,
): Promise<TripDetails> {
  const baseUrl = `/trips/${tripId}`

  const [
    trip,
    activities,
    tasks,
    expenses,
    transports,
    accommodations,
    files,
  ] = await Promise.all([
    httpClient.get(`${baseUrl}`),
    httpClient.get(`${baseUrl}/activities`),
    httpClient.get(`${baseUrl}/checklist`),
    httpClient.get(`${baseUrl}/expenses`),
    httpClient.get(`${baseUrl}/transports`),
    httpClient.get(`${baseUrl}/accommodations`),
    httpClient.get(`${baseUrl}/files`),
  ])

  return {
    trip: trip.data,
    activities: activities.data,
    tasks: tasks.data,
    expenses: expenses.data,
    transports: transports.data,
    accommodations: accommodations.data,
    files: files.data,
  }
}

export async function downloadTripExport(
  tripId: number,
): Promise<Blob> {
  const { data } = await httpClient.get<Blob>(
    `/trips/${tripId}/export`,
    { responseType: 'blob' },
  )

  return data
}
