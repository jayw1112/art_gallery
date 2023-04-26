import React, { Component } from 'react'
import ErrorCard from './ErrorCard'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, errorMessage: '' }
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true, errorMessage: error.message })
    console.error('ErrorBoundary caught an error', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorCard
          error={this.state.errorMessage}
          fallback={
            this.props.fallback || (
              <h2>Something went wrong. Please try again later.</h2>
            )
          }
        />
      )
    }
    return this.props.children
  }
}
