import { httpClient } from './http'

export type UserProfile = {
  id: number
  name: string
  surname: string
  profile_photo: string | null
  username: string
  email: string
  default_currency: string
}

export type UserProfilePayload = Omit<UserProfile, 'id'>

export async function getCurrentUser(): Promise<UserProfile> {
  const { data } = await httpClient.get<UserProfile>('/users/me')
  return data
}

export async function updateCurrentUser(
  payload: UserProfilePayload,
): Promise<UserProfile> {
  const { data } = await httpClient.patch<UserProfile>('/users/me', payload)
  return data
}

export async function deleteCurrentUser(): Promise<void> {
  await httpClient.delete('/users/me')
}
