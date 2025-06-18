const API_BASE_URL = 'http://localhost:3001/api'

interface ApiResponse<T> {
  data?: T
  error?: string
}

export async function api<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('token')
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'An error occurred')
    }

    return { data }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'An error occurred',
    }
  }
}

// Auth API calls
export const auth = {
  login: (email: string, password: string) =>
    api<{ token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  signup: (email: string, password: string, username: string, phone?: string) =>
    api<{ message: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, username, phone }),
    }),

  logout: () => {
    localStorage.removeItem('token')
    window.location.reload()
  },
}

// Media API calls
export const media = {
  add: (mediaData: {
    title: string
    file_path: string
    file_type: string
    file_size: number
    description?: string
    privacy_setting: 'public' | 'private'
  }) =>
    api<{ id: number }>('/media', {
      method: 'POST',
      body: JSON.stringify(mediaData),
    }),

  get: (userId: number) =>
    api<Array<{
      id: number
      title: string
      file_path: string
      file_type: string
      file_size: number
      description?: string
      privacy_setting: 'public' | 'private'
      created_at: string
    }>>(`/media?user_id=${userId}`),

  getPublic: (username: string) =>
    api<Array<{
      id: number
      title: string
      file_path: string
      file_type: string
      file_size: number
      description?: string
      created_at: string
    }>>(`/site/${username}`),
}

// User API calls
export const user = {
  getProfile: () =>
    api<{
      id: number
      email: string
      username: string
      phone?: string
      created_at: string
    }>('/user/profile'),

  updateProfile: (data: {
    username?: string
    phone?: string
  }) =>
    api<{ message: string }>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updatePassword: (data: {
    current_password: string
    new_password: string
  }) =>
    api<{ message: string }>('/user/password', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
} 