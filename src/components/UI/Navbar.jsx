import React, { useContext, useState, useEffect, useRef } from 'react'
import { AuthContext } from '../../source/auth-context'
import classes from './Navbar.module.css'
import logo from '../../assets/paint_brush_logo1.png'
import { NavLink, Link } from 'react-router-dom'
import { getAuth, signOut } from 'firebase/auth'
import AccountModal from './AccountModal'
import menu from '../../assets/menu.svg'

function Navbar() {
  const { currentUser } = useContext(AuthContext)
  const auth = getAuth()
  const dropdownRef = useRef(null)
  const buttonRef = useRef(null)

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(true)

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

  // Close the dropdown menu if the user clicks outside of it

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     // if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //     if (
  //       dropdownRef.current &&
  //       !dropdownRef.current.contains(event.target) &&
  //       buttonRef.current !== event.target
  //     ) {
  //       setIsDropdownOpen(true)
  //     }
  //   }

  //   // Attach the listeners on component mount.
  //   document.addEventListener('mousedown', handleClickOutside)
  //   document.addEventListener('touchstart', handleClickOutside)

  //   // Detach the listeners on component unmount.
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside)
  //     document.removeEventListener('touchstart', handleClickOutside)
  //   }
  // }, []) // Empty array ensures that effect is only run on mount and unmount

  // Close the dropdown menu if the user resizes the window to be larger than 480px

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 610) {
        setIsDropdownOpen(true)
      }
    }

    window.addEventListener('resize', handleResize)

    // Cleanup function to remove the event listener when the component unmounts
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarHeader}>
        <img src={logo} alt='logo' className={classes.logo} />
        <h1>Palette Express</h1>
        <button
          ref={buttonRef}
          className={classes.dropdownButton}
          onClick={() => setIsDropdownOpen((prevState) => !prevState)}
        >
          <img src={menu} alt='menu' className={classes.menu} />
        </button>
      </div>
      <div
        ref={dropdownRef}
        className={`${classes.navbarMenu} ${
          isDropdownOpen
            ? classes.dropdownContentActive
            : classes.dropdownContent
        }`}
      >
        <div className={classes.buttons}>
          <div className={classes.leftSide}>
            <NavLink
              to='/'
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
              onClick={() => setIsDropdownOpen(true)}
            >
              Home
            </NavLink>
            <NavLink
              to='about'
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              onClick={() => setIsDropdownOpen(true)}
            >
              About
            </NavLink>
            {currentUser && (
              <NavLink
                to='/upload'
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
                onClick={() => setIsDropdownOpen(true)}
              >
                Upload
              </NavLink>
            )}
            {currentUser && (
              <NavLink
                to='/search'
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
                onClick={() => setIsDropdownOpen(true)}
              >
                Search
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
                  onClick={() => setIsDropdownOpen(true)}
                >
                  Login
                </NavLink>
                <NavLink
                  to='/signup'
                  className={({ isActive }) =>
                    isActive ? classes.active : undefined
                  }
                  onClick={() => setIsDropdownOpen(true)}
                >
                  Signup
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to='feed'
                  className={({ isActive }) =>
                    isActive ? classes.active : undefined
                  }
                  onClick={() => setIsDropdownOpen(true)}
                >
                  Feed
                </NavLink>
                <NavLink
                  to={`/profile/${currentUser.uid}`}
                  className={({ isActive }) =>
                    isActive ? classes.active : undefined
                  }
                  onClick={() => setIsDropdownOpen(true)}
                >
                  Profile
                </NavLink>
                <Link
                  onClick={() => {
                    openAccountModal()
                    setIsDropdownOpen(true)
                  }}
                >
                  Account
                </Link>
                <Link
                  to='/'
                  onClick={() => {
                    handleSignOut()
                    setIsDropdownOpen(true)
                  }}
                >
                  Logout
                </Link>
              </>
            )}
          </div>
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
