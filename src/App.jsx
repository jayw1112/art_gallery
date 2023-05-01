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
import Profile from './components/User/Profile'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const auth = getAuth()
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid
    console.log(uid)
    const username = user.displayName
    console.log(username)

    // ...
  } else {
    // User is signed out
    return null
    // ...
  }
})

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
        path: `/profile/:uid`,
        element: <Profile />,
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
