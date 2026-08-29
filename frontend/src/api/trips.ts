import type {
  Trip,
  TripAccommodation,
  TripActivity,
  TripCreatePayload,
  TripDetails,
  TripExpense,
  TripFile,
  TripTask,
  TripTransport,
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
  const { data: trip } =
    await httpClient.get<Trip>(baseUrl)

  async function getOptionalList<T>(
    url: string,
  ): Promise<T[]> {
    try {
      const { data } =
        await httpClient.get<T[]>(url)
      return data
    } catch {
      return []
    }
  }

  const [
    activities,
    tasks,
    expenses,
    transports,
    accommodations,
    files,
  ] = await Promise.all([
    getOptionalList<TripActivity>(
      `${baseUrl}/activities`,
    ),
    getOptionalList<TripTask>(
      `${baseUrl}/checklist`,
    ),
    getOptionalList<TripExpense>(
      `${baseUrl}/expenses`,
    ),
    getOptionalList<TripTransport>(
      `${baseUrl}/transports`,
    ),
    getOptionalList<TripAccommodation>(
      `${baseUrl}/accommodations`,
    ),
    trip.status === 'completed'
      ? getOptionalList<TripFile>(
          `${baseUrl}/files`,
        )
      : Promise.resolve([]),
  ])

  return {
    trip,
    activities,
    tasks,
    expenses,
    transports,
    accommodations,
    files,
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
