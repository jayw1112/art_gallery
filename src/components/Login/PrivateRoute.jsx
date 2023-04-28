import { useContext } from 'react'
import { AuthContext } from '../../source/auth-context'
import { Navigate } from 'react-router-dom'

function PrivateRoute({ children }) {
  const { currentUser } = useContext(AuthContext)

  return currentUser ? children : <Navigate to='/login' replace />
}

export default PrivateRoute
