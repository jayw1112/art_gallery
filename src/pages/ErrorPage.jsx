import { useRouteError } from 'react-router-dom'
import ErrorPageCard from '../components/Error/ErrorPageCard'
import Navbar from '../components/UI/Navbar'

export default function ErrorPage() {
  const error = useRouteError()
  console.error(error)

  return (
    <div>
      <Navbar />
      {error ? (
        <ErrorPageCard error={error} />
      ) : (
        <ErrorPageCard
          error={{
            status: 404,
            statusText: 'Not Found',
            data: 'Page not found',
          }}
        />
      )}
    </div>
  )
}
