import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../../../shared/lib/test/Test.lib'
import { TaskBar } from './Task-bar.ui'
import tasks from '../../../entities/task/task.api'
import { startOfMonth } from 'date-fns'
import type { ViewGantt } from '../toolbar/toolbar.types'
import { screen } from '@testing-library/dom'

const task = tasks[0]

describe('TaskBar', () => {
  it('should render', () => {
    renderTaskBar('day', task.startDate, task.endDate)

    expect(screen.getByText(task.title)).toBeInTheDocument()
  })

  it('should render milestone if start and end date are the same', () => {
    const date = new Date()

    renderTaskBar('day', date, date)
    expect(screen.getByTestId('milestone')).toBeInTheDocument()
  })

  it('should render progress bar if task is not a milestone', () => {
    renderTaskBar('day', task.startDate, task.endDate)
    expect(screen.getByTestId('progress-bar')).toBeInTheDocument()
  })
})

function renderTaskBar(view: ViewGantt, startDate: Date, endDate: Date) {
  const user = userEvent.setup({ delay: null })
  const renderResult = renderWithProviders(
    <TaskBar
      task={{ ...task, startDate, endDate }}
      height={80}
      startDate={startOfMonth(startDate)}
      widthPerHeader={100}
      view={view}
    />
  )
  return { ...renderResult, ...user }
}
