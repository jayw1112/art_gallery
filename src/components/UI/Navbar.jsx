import React, { useContext, useState } from 'react'
import { AuthContext } from '../../source/auth-context'
import classes from './Navbar.module.css'
import logo from '../../assets/paint_brush_logo1.png'
import { NavLink, Link } from 'react-router-dom'
import { getAuth, signOut } from 'firebase/auth'
import AccountModal from './AccountModal'

function Navbar() {
  const { currentUser } = useContext(AuthContext)
  const auth = getAuth()

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('Signed Out')
      })
      .catch((error) => {
        console.error('Error signing out:', error)
      })
  }

  const openAccountModal = () => {
    setIsAccountModalOpen(true)
  }

  const closeAccountModal = () => {
    setIsAccountModalOpen(false)
  }

  return (
    <nav className={classes.navbar}>
      <img src={logo} alt='logo' className={classes.logo} />
      <h1>Palette Express</h1>
      <div className={classes.buttons}>
        <div className={classes.leftSide}>
          <NavLink
            to='/'
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
            end
          >
            Home
          </NavLink>
          <NavLink
            to='/'
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
          >
            About
          </NavLink>
          {currentUser && (
            <NavLink
              to='/upload'
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Upload
            </NavLink>
          )}
        </div>
        <div className={classes.rightSide}>
          {!currentUser ? (
            <>
              <NavLink
                to='/login'
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                Login
              </NavLink>
              <NavLink
                to='/signup'
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                Signup
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to={`/profile/${currentUser.uid}`}
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                Profile
              </NavLink>
              <Link onClick={openAccountModal}>Account</Link>
              <Link to='/' onClick={handleSignOut}>
                Logout
              </Link>
            </>
          )}
        </div>
      </div>
      {currentUser && (
        <AccountModal
          isModalOpen={isAccountModalOpen}
          closeModal={closeAccountModal}
        />
      )}
    </nav>
  )
}

export default Navbar
