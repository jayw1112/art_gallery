import { Outlet } from 'react-router-dom'
import Navbar from '../components/UI/Navbar'

export default function Nav() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}
