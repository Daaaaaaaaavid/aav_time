export async function fetchServerTime(): Promise<{ now: string }> {
  const response = await fetch('http://localhost:5000/api/time')
  if (!response.ok) {
    throw new Error('Failed to fetch server time')
  }
  return response.json()
}

export async function fetchHealth(): Promise<{ status: string; service: string; timestamp: string }> {
  const response = await fetch('http://localhost:5000/api/health')
  if (!response.ok) {
    throw new Error('Failed to fetch health')
  }
  return response.json()
}