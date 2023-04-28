import { useState } from 'react'
import classes from './AuthForm.module.css'

function AuthForm({ formType, onSubmit, errorMessage }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')

  const handleFormSubmit = (e) => {
    e.preventDefault()
    onSubmit(email, password, username)
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
  }

  return (
    <form className={classes.authForm} onSubmit={handleFormSubmit}>
      <h2>{formType === 'login' ? 'Login' : 'Signup'}</h2>
      {formType === 'signup' && (
        <input
          type='text'
          placeholder='Username'
          value={username}
          onChange={handleUsernameChange}
        />
      )}
      <input
        type='email'
        placeholder='Email'
        value={email}
        onChange={handleEmailChange}
      />
      <input
        type='password'
        placeholder='Password'
        value={password}
        onChange={handlePasswordChange}
      />
      {errorMessage && <p className={classes.errorMessage}>{errorMessage}</p>}
      <button type='submit'>{formType === 'login' ? 'Login' : 'Signup'}</button>
    </form>
  )
}

export default AuthForm
