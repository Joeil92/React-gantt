import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../shared/lib/test/Test.lib'
import { Toolbar } from './Toolbar.ui'
import { screen } from '@testing-library/dom'

const mockOnTasksChange = vi.fn()
const mockOnViewGanttChange = vi.fn()

describe('Toolbar', () => {
  it('should render a toolbar', () => {
    renderToolbar()
    expect(screen.getByText('Ajouter une tâche')).toBeInTheDocument()
  })

  it('should create a task when user click on button', async () => {
    const { click } = renderToolbar()
    await click(screen.getByText('Ajouter une tâche'))
    expect(mockOnTasksChange).toHaveBeenCalledOnce()
  })

  it('should change view gantt when user click on button', async () => {
    const { click } = renderToolbar()
    await click(screen.getByText('Mois'))
    expect(mockOnViewGanttChange).toHaveBeenCalledWith('month')
  })
})

function renderToolbar() {
  const user = userEvent.setup({ delay: null })
  const renderResult = renderWithProviders(
    <Toolbar
      onTasksChange={mockOnTasksChange}
      viewGantt={'day'}
      onViewGanttChange={mockOnViewGanttChange}
    />
  )
  return { ...renderResult, ...user }
}
