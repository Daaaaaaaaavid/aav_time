import { useQuery } from '@tanstack/react-query'
import { fetchServerTime } from '../api/time'

export default function Header() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['server-time'],
    queryFn: fetchServerTime,
    refetchInterval: 1000,
  })

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">AAV-Time</h1>
      <div className="text-sm">
        {isLoading ? 'Lade Zeit...' : isError ? 'Zeitfehler' : `Server: ${new Date(data.now).toLocaleTimeString()}`}
      </div>
    </header>
  )
}