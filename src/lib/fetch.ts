// Fetch wrapper with error handling
export async function apiCall<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'API request failed')
  }

  return data.data
}

// Get all items with pagination
export async function fetchAllPaginated<T>(
  url: string,
  pageSize: number = 10
): Promise<T[]> {
  let allItems: T[] = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    const response = await fetch(`${url}?page=${page}&pageSize=${pageSize}`)
    const data = await response.json()

    if (data.success) {
      allItems = [...allItems, ...data.data.data]
      page++
      hasMore = data.data.totalPages >= page
    } else {
      hasMore = false
    }
  }

  return allItems
}
