import React from 'react'
import classes from './Navbar.module.css'
import logo from '../../assets/paint_brush_logo1.png'
import { NavLink } from 'react-router-dom'

function Navbar() {
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
          <NavLink
            to='/upload'
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
          >
            Upload
          </NavLink>
        </div>
        <div className={classes.rightSide}>
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
        </div>
      </div>
    </nav>
  )
}

export default Navbar
