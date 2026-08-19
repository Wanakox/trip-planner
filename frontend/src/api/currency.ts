import { httpClient } from './http'

export type Currency = {
  code: string
  name: string
}

export async function getCurrencies(): Promise<Currency[]> {
  const { data } = await httpClient.get<Currency[]>('/currencies')
  return data
}
