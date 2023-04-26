import './App.css'
import Nav from '../src/pages/Nav'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Nav />,
    children: [{ index: true, element: <Home /> }],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
