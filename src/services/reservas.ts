import { api } from './api'

export type Reserva = {
  id: string
  nomeCliente: string
  dataReserva: string
  numeroPessoas: number
  status: 'Pendente' | 'Confirmado' | 'Cancelado' | 'Confirmada' | 'Cancelada'
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

export type UpdateReserva = {
  id?: string
  nomeCliente?: string
  dataReserva?: string
  numeroPessoas?: number
  observacoes?: string
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

export async function confirmarReserva(id: string): Promise<void> {
  const url = process.env.NEXT_PUBLIC_API_RESERVAS_URL!
  await api.post(`${url}/${id}/confirmar`)
}

export async function cancelarReserva(id: string): Promise<void> {
  const url = process.env.NEXT_PUBLIC_API_RESERVAS_URL!
  await api.post(`${url}/${id}/cancelar`)
}

export async function updateReserva(
  id:string,
  payload: UpdateReserva
): Promise<void> {
  const url = process.env.NEXT_PUBLIC_API_RESERVAS_URL!
  await api.put(`${url}/${id}`, payload)
}