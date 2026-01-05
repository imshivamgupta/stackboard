import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

interface LoginResponse {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
  accessToken: string
  refreshToken: string
}

interface LoginRequest {
  username: string
  password: string
  expiresInMins?: number
}

export const Route = createFileRoute('/app/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        },
      )

      if (!response.ok) {
        throw new Error('Login failed')
      }

      return response.json() as Promise<LoginResponse>
    },
    onSuccess: (data) => {
      console.log('Login successful:', data)
      // Store token in localStorage or handle authentication state
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('user', JSON.stringify(data))
      // Navigate to categories page
      navigate({ to: '/app' })
    },
    onError: (error) => {
      console.error('Login error:', error)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate({
      username,
      password,
      expiresInMins: 30,
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          {/* <p className="mt-2 text-center text-sm text-gray-600">
            Use username: <span className="font-semibold">emilys</span> <br />
            password: <span className="font-semibold">emilyspass</span>
          </p> */}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter password"
              />
            </div>
          </div>

          {loginMutation.isError && (
            <div className="text-red-600 text-sm text-center">
              Login failed. Please check your credentials.
            </div>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
