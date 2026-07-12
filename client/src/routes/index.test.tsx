import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Home } from './index'

describe('Home', () => {
  it('renders the message as a heading', () => {
    render(<Home message="Hello, SiftVault!" />)

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Hello, SiftVault!')
  })

  it('renders whatever message it is given', () => {
    render(<Home message="hello bro" />)

    expect(screen.getByText('hello bro')).toBeInTheDocument()
  })
})
