import { api } from './api'

export type Reserva = {
  id: string
  nomeCliente: string
  dataReserva: string
  numeroPessoas: number
  status: 'Pendente' | 'Confirmado' | 'Cancelado'
  observacoes?: string
}

export type PaginatedReservas = {
  items: Reserva[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export async function fetchReservas(): Promise<PaginatedReservas> {
  const url = process.env.NEXT_PUBLIC_API_RESERVAS_URL!
  const { data } = await api.get<PaginatedReservas>(url)
  return data
}

export async function createReserva(payload: Omit<Reserva, "id" | "status">): Promise<void> {
  const url = process.env.NEXT_PUBLIC_API_RESERVAS_URL!
  await api.post(url, payload)
}