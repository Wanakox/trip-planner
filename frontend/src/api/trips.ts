import type {
  Trip,
  TripAccommodation,
  TripActivity,
  TripCreatePayload,
  TripDetails,
  DestinationCreatePayload,
  DestinationOrderPayload,
  ActivityOrderPayload,
  ActivityPayload,
  TripExpense,
  TripFile,
  TripTask,
  TripTransport,
  TripUpdatePayload,
  TransportPayload,
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

export async function getTrip(
  tripId: number,
): Promise<Trip> {
  const { data } =
    await httpClient.get<Trip>(`/trips/${tripId}`)

  return data
}

export async function updateTrip(
  tripId: number,
  payload: TripUpdatePayload,
): Promise<Trip> {
  const { data } =
    await httpClient.patch<Trip>(
      `/trips/${tripId}`,
      payload,
    )

  return data
}

export async function rateTrip(
  tripId: number,
  rating: number,
): Promise<Trip> {
  const { data } =
    await httpClient.put<Trip>(
      `/trips/${tripId}/rating`,
      { rating },
    )

  return data
}

export async function deleteTrip(
  tripId: number,
): Promise<void> {
  await httpClient.delete(`/trips/${tripId}`)
}

export async function addDestination(
  tripId: number,
  payload: DestinationCreatePayload,
): Promise<Trip> {
  const { data } = await httpClient.post<Trip>(
    `/trips/${tripId}/destinations`,
    payload,
  )
  return data
}

export async function updateDestination(
  tripId: number,
  destinationId: number,
  payload: DestinationCreatePayload,
): Promise<Trip> {
  const { data } = await httpClient.patch<Trip>(
    `/trips/${tripId}/destinations/${destinationId}`,
    payload,
  )
  return data
}

export async function deleteDestination(
  tripId: number,
  destinationId: number,
): Promise<Trip> {
  const { data } = await httpClient.delete<Trip>(
    `/trips/${tripId}/destinations/${destinationId}`,
  )
  return data
}

export async function reorderDestinations(
  tripId: number,
  payload: DestinationOrderPayload,
): Promise<Trip> {
  const { data } = await httpClient.put<Trip>(
    `/trips/${tripId}/destinations/order`,
    payload,
  )
  return data
}

export async function addActivity(
  tripId: number,
  payload: ActivityPayload,
): Promise<TripActivity> {
  const { data } = await httpClient.post<TripActivity>(
    `/trips/${tripId}/activities`,
    payload,
  )
  return data
}

export async function getTripActivities(
  tripId: number,
): Promise<TripActivity[]> {
  const { data } = await httpClient.get<TripActivity[]>(
    `/trips/${tripId}/activities`,
  )
  return data
}

export async function updateActivity(
  tripId: number,
  activityId: number,
  payload: ActivityPayload,
): Promise<TripActivity> {
  const { data } = await httpClient.patch<TripActivity>(
    `/trips/${tripId}/activities/${activityId}`,
    payload,
  )
  return data
}

export async function deleteActivity(
  tripId: number,
  activityId: number,
): Promise<void> {
  await httpClient.delete(
    `/trips/${tripId}/activities/${activityId}`,
  )
}

export async function setActivityCompleted(
  tripId: number,
  activityId: number,
  completed: boolean,
): Promise<TripActivity> {
  const { data } = await httpClient.put<TripActivity>(
    `/trips/${tripId}/activities/${activityId}/completed`,
    { completed },
  )
  return data
}

export async function reorderActivities(
  tripId: number,
  payload: ActivityOrderPayload,
): Promise<TripActivity[]> {
  const { data } = await httpClient.put<TripActivity[]>(
    `/trips/${tripId}/activities/order`,
    payload,
  )
  return data
}

export async function getTripTransports(
  tripId: number,
): Promise<TripTransport[]> {
  const { data } = await httpClient.get<TripTransport[]>(
    `/trips/${tripId}/transports`,
  )
  return data
}

export async function addTransport(
  tripId: number,
  payload: TransportPayload,
): Promise<TripTransport> {
  const { data } = await httpClient.post<TripTransport>(
    `/trips/${tripId}/transports`,
    payload,
  )
  return data
}

export async function updateTransport(
  tripId: number,
  transportId: number,
  payload: TransportPayload,
): Promise<TripTransport> {
  const { data } = await httpClient.patch<TripTransport>(
    `/trips/${tripId}/transports/${transportId}`,
    payload,
  )
  return data
}

export async function deleteTransport(
  tripId: number,
  transportId: number,
): Promise<void> {
  await httpClient.delete(
    `/trips/${tripId}/transports/${transportId}`,
  )
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
