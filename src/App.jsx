import './App.css'
import Nav from '../src/pages/Nav'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import ErrorPage from './pages/ErrorPage'
import Upload from './pages/Upload'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { AuthProvider } from './source/auth-context'
import PrivateRoute from './components/Login/PrivateRoute'
import Profile from './User/Profile'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Nav />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'upload',
        element: (
          <PrivateRoute>
            <Upload />
          </PrivateRoute>
        ),
      },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      {
        path: 'profile',
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
    ],
  },
])

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
