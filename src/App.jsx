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
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import Profile from './components/User/Profile'
import FollowingFeed from './pages/FollowingFeed'
import ImageWebPage from './pages/ImageWebPage'
import SearchPage from './pages/SearchPage'
import AboutPage from './pages/AboutPage'
import FollowingPage from './pages/FollowingPage'
import FollowersPage from './pages/FollowersPage'

const auth = getAuth()
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid
    // console.log(uid)
    const username = user.displayName
    // console.log(username)

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
      { path: 'feed', element: <FollowingFeed /> },
      { path: 'image/:ownerId/:imageId', element: <ImageWebPage /> },
      {
        path: 'search',
        element: (
          <PrivateRoute>
            <SearchPage />
          </PrivateRoute>
        ),
      },
      { path: 'about', element: <AboutPage /> },
      { path: 'following/:uid', element: <FollowingPage /> },
      { path: 'followers/:uid', element: <FollowersPage /> },
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
