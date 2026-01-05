import { redirect } from '@tanstack/react-router'

export interface AuthState {
  accessToken: string | null
  user: any | null
}

export function getAuthState(): AuthState {
  const accessToken = localStorage.getItem('accessToken')
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null

  return {
    accessToken,
    user,
  }
}

export function isAuthenticated(): boolean {
  const { accessToken } = getAuthState()
  return !!accessToken
}

export function requireAuth() {
  if (!isAuthenticated()) {
    throw redirect({ to: '/app/login' })
  }
}

export function logout() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('user')
}

// API Interceptor - Fetch wrapper that automatically adds auth token
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const { accessToken } = getAuthState()

  const headers = new Headers(options.headers)

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  // Handle unauthorized responses
  if (response.status === 401) {
    logout()
    throw redirect({ to: '/app/login' })
  }

  return response
}
