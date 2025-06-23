import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../shared/lib/test/Test.lib'
import { TaskCell } from './Task-cell.ui'
import { screen, waitFor } from '@testing-library/dom'
import { getTasks } from '../../../shared/api/api.service'
import { differenceInBusinessDays, formatDate } from 'date-fns'

const mockOnTasksChange = vi.fn()
const { data: tasks } = getTasks()

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

  it('should update task when user change date', async () => {
    const value = new Date('02/01/2025')
    const dateFormat = formatDate(value, 'dd/MM/yyyy')
    const { type, clear } = renderTaskCell('startDate', value)

    await userEvent.dblClick(screen.getByText(dateFormat))

    const input = screen.getByDisplayValue(dateFormat)

    await clear(input)
    await type(input, `${dateFormat}{Enter}`)

    expect(mockOnTasksChange).not.toHaveBeenCalled() // It won't be called immediately

    await waitFor(
      () => {
        expect(input).not.toBeInTheDocument()
        expect(screen.getByText(dateFormat)).toBeInTheDocument()
      },
      { timeout: 3000 }
    )
  })

  it('should render a duration between start and end date', () => {
    const start = tasks[0].startDate
    const end = tasks[0].endDate
    const duration = differenceInBusinessDays(end, start) + 2

    renderTaskCell('duration', undefined)

    expect(screen.getByText(`${duration}j`)).toBeInTheDocument()
    expect(mockOnTasksChange).not.toHaveBeenCalled()
  })

  it('should update task when user change progress', async () => {
    const value = 50
    const { type, clear } = renderTaskCell('progression', value)

    await userEvent.dblClick(screen.getByText(value + '%'))

    const input = screen.getByDisplayValue(value)

    await clear(input)
    await type(input, `${value + 1}%{Enter}`)

    expect(mockOnTasksChange).not.toHaveBeenCalled() // It won't be called immediately

    await waitFor(() => {
      expect(input).not.toBeInTheDocument()
      expect(screen.getByText(value + 1 + '%')).toBeInTheDocument()
    })
  })
})

function renderTaskCell(fieldName: string, value: unknown) {
  const user = userEvent.setup()
  const renderResult = renderWithProviders(
    <TaskCell
      task={tasks[0]}
      displayValue={value}
      width={100}
      fieldName={fieldName}
      onTasksChange={mockOnTasksChange}
    />
  )
  return { ...renderResult, ...user }
}
