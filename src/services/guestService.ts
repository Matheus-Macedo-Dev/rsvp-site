const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  throw new Error('API_URL is not defined in environment variables')
}

export interface GuestResponse {
  id: number
  name: string // 'Nome'
  hasResponded: boolean // 'Respondeu'
  isAttending: boolean // 'Confirmado'
  responseDate?: string // 'Data'
}

async function fetchWithRetry(
  url: string, 
  options: RequestInit, 
  retries = 3
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options)
      if (response.ok) return response
    } catch (err) {
      if (i === retries - 1) throw err
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
  throw new Error('Failed after retries')
}

export async function fetchGuests(): Promise<GuestResponse[]> {
  try {
    const response = await fetchWithRetry(`${API_URL}?t=${Date.now()}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      },
      credentials: 'omit'
    })

    const data = await response.json()
    console.log('API Response:', data)
    return data.guests.map((guest: any) => ({
      id: guest.id,
      name: guest.Nome || guest.name,
      hasResponded: Boolean(guest.Respondeu || guest.hasResponded),
      isAttending: Boolean(guest.Confirmado || guest.isAttending),
      responseDate: guest.Data || guest.responseDate
    }))
  } catch (error) {
    console.error('Error fetching guests:', error)
    throw error
  }
}

export async function updateGuestResponse(
  guestId: number,
  name: string,
  isAttending: boolean
): Promise<boolean> {
  try {
    // Add timestamp to prevent caching
    const params = new URLSearchParams({
      id: guestId.toString(),
      name: name,
      isAttending: isAttending.toString(),
      action: 'update',
      t: Date.now().toString()
    })

    const response = await fetchWithRetry(`${API_URL}?${params.toString()}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      },
      credentials: 'omit',
      cache: 'no-cache' // Prevent caching
    })

    const result = await response.json()
    console.log('Update response:', result) // Add logging
    return result.success
  } catch (error) {
    console.error('Error updating guest response:', error)
    throw error
  }
}