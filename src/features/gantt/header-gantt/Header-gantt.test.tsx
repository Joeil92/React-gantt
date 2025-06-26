import { describe, expect, it } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../../shared/lib/test/Test.lib'
import { getGanttHeaders } from '../../../shared/api/api.service'
import { HeaderGantt } from './Header-gantt.ui'
import { screen } from '@testing-library/dom'

const { data: headers } = getGanttHeaders()

describe('HeaderGantt', () => {
  it('should render header gantt', () => {
    renderHeaderGantt()
    expect(screen.getByText(headers[0].label)).toBeInTheDocument()
  })
})

function renderHeaderGantt() {
  const user = userEvent.setup({ delay: null })
  const renderResult = renderWithProviders(
    <HeaderGantt
      header={headers[0]}
      headers={headers}
      headerSize={{ height: 60, width: 200 }}
      isResizing={false}
      onResizingChange={() => {}}
      onHeadersChange={() => {}}
    />
  )
  return { ...renderResult, ...user }
}
