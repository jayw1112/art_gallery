import React from 'react'
import classes from './Navbar.module.css'
import logo from '../assets/paint_brush_logo1.png'
// import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <nav className={classes.navbar}>
      <img src={logo} alt='logo' className={classes.logo} />
      <h1>Palette Express</h1>
      <div className={classes.buttons}>
        <div className={classes.leftSide}>
          <a to='/'>Home</a>
          <a to='/about'>About</a>
          <a to='/contact'>Contact</a>
        </div>
        <div className={classes.rightSide}>
          <a to='/login'>Login</a>
          <a to='/signup'>Signup</a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
