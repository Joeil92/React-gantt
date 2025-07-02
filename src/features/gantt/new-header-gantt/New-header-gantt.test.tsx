import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../shared/lib/test/Test.lib'
import ganttHeaders from '../../../entities/gantt-header/gantt-header.api'
import { NewHeaderGantt } from './New-header-gantt'
import { screen, waitFor } from '@testing-library/dom'

const mockOnHeadersChange = vi.fn()

describe('NewHeaderGantt', () => {
  it('should render', () => {
    renderNewHeaderGantt()

    expect(screen.getByPlaceholderText('Nouvelle colonne')).toBeInTheDocument()
  })

  it('should successfully call onHeadersChange', async () => {
    const { type, click } = renderNewHeaderGantt()
    const input = screen.getByPlaceholderText('Nouvelle colonne')
    await type(input, 'Prédécesseur')
    await click(screen.getByText('Prédécesseur'))

    await waitFor(() => {
      expect(mockOnHeadersChange).toHaveBeenCalled()
    })
  })

  it('should find not visible headers', () => {
    renderNewHeaderGantt()

    const header = ganttHeaders.find((header) => header.isVisible)
    expect(screen.queryByText(header!.label)).not.toBeInTheDocument()
  })
})

function renderNewHeaderGantt() {
  const user = userEvent.setup({ delay: null })
  const renderResult = renderWithProviders(
    <NewHeaderGantt
      headers={ganttHeaders}
      onHeadersChange={mockOnHeadersChange}
      headerHeight={60}
    />
  )
  return { ...renderResult, ...user }
}
