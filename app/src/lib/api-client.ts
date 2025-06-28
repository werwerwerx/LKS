const TOKEN_KEY = 'admin_token'

function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY)
  }
  return null
}

interface ApiRequestOptions extends RequestInit {
  requireAuth?: boolean
}

export async function apiRequest(url: string, options: ApiRequestOptions = {}) {
  const { requireAuth = false, headers = {}, ...restOptions } = options
  
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>)
  }

  if (requireAuth) {
    const token = getToken()
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`
    }
  }

  const response = await fetch(url, {
    ...restOptions,
    headers: requestHeaders
  })

  if (!response.ok) {
    if (response.status === 401 && requireAuth) {
      window.location.href = '/login'
      throw new Error('Unauthorized')
    }
    
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
  }

  return response
}

export async function apiGet(url: string, options: ApiRequestOptions = {}) {
  return apiRequest(url, { ...options, method: 'GET' })
}

export async function apiPost(url: string, data?: any, options: ApiRequestOptions = {}) {
  return apiRequest(url, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined
  })
}

export async function apiPut(url: string, data?: any, options: ApiRequestOptions = {}) {
  return apiRequest(url, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined
  })
}

export async function apiDelete(url: string, data?: any, options: ApiRequestOptions = {}) {
  return apiRequest(url, {
    ...options,
    method: 'DELETE',
    body: data ? JSON.stringify(data) : undefined
  })
}

export async function apiUpload(url: string, formData: FormData, options: ApiRequestOptions = {}) {
  const { requireAuth = true, headers = {}, ...restOptions } = options
  
  const requestHeaders: Record<string, string> = {
    ...(headers as Record<string, string>)
  }

  if (requireAuth) {
    const token = getToken()
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`
    }
  }

  const response = await fetch(url, {
    ...restOptions,
    method: 'POST',
    headers: requestHeaders,
    body: formData
  })

  if (!response.ok) {
    if (response.status === 401) {
      window.location.href = '/login'
      throw new Error('Unauthorized')
    }
    
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
  }

  return response
} 