import { api } from './api'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const url = process.env.NEXT_PUBLIC_API_LOGIN_URL!
  const { data } = await api.post<AuthResponse>(url, payload)
  return data
}

export async function register(
  payload: RegisterPayload
): Promise<AuthResponse> {
  const url = process.env.NEXT_PUBLIC_API_REGISTER_URL!
  const { data } = await api.post<AuthResponse>(url, payload)
  return data
}
