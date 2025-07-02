import { describe, it } from 'vitest'
import { render } from '@testing-library/react'
import Home from './Home'

describe('Home', () => {
  it('should be rendered', () => {
    render(<Home />)
  })
})
