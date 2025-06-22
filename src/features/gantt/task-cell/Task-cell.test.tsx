import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../shared/lib/test/Test.lib'
import { TaskCell } from './Task-cell.ui'
import { screen, waitFor } from '@testing-library/dom'

const mockOnTasksChange = vi.fn()

describe('TaskCell', () => {
  it('should render a display value', () => {
    renderTaskCell('title', 'test')

    expect(screen.getByText('test')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('test')).not.toBeInTheDocument()
  })

  it('should display input when user double click', async () => {
    const value = 'test'

    renderTaskCell('title', value)
    expect(screen.queryByDisplayValue(value)).not.toBeInTheDocument()

    await userEvent.dblClick(screen.getByText(value))
    expect(screen.getByDisplayValue(value)).toBeInTheDocument()
  })

  it('should update task when user change input', async () => {
    const value = 'test'
    const { type, clear } = renderTaskCell('title', value)

    await userEvent.dblClick(screen.getByText(value))

    const input = screen.getByDisplayValue(value)

    await clear(input)
    await type(input, 'test2{Enter}')

    expect(mockOnTasksChange).not.toHaveBeenCalled() // It won't be called immediately

    await waitFor(
      () => {
        expect(input).not.toBeInTheDocument()
        expect(screen.getByText('test2')).toBeInTheDocument()
        expect(mockOnTasksChange).toHaveBeenCalledWith('title', 'test2')
      },
      { timeout: 3000 }
    )
  })
})

function renderTaskCell(fieldName: string, value: string) {
  const user = userEvent.setup()
  const renderResult = renderWithProviders(
    <TaskCell
      displayValue={value}
      width={100}
      fieldName={fieldName}
      onTasksChange={mockOnTasksChange}
    />
  )
  return { ...renderResult, ...user }
}
