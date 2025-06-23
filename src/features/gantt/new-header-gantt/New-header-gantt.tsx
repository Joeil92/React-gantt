import { useState } from 'react'
import type { GanttHeader } from '../../../entities/gantt-header/gantt-header.types'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from '../../../shared/ui/dropdown/Dropdown.ui'

type NewHeaderGanttProps = {
  headers: GanttHeader[]
  onHeadersChange: (headers: GanttHeader[]) => void
}
export function NewHeaderGantt({
  headers,
  onHeadersChange,
}: NewHeaderGanttProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')

  const headersFiltered = headers.filter(
    (header) =>
      !header.isVisible &&
      header.label.toLowerCase().includes(input.toLowerCase())
  )

  const handleChange = (field: string) => {
    const updatedHeaders = headers.map((header) =>
      header.field === field ? { ...header, isVisible: true } : header
    )
    setIsOpen(false)
    onHeadersChange(updatedHeaders)
  }

  return (
    <Dropdown defaultOpen={isOpen}>
      <div className="border-grey-100 hover:bg-grey-100 w-[250px] border-y border-e">
        <DropdownToggle>
          <input
            type="text"
            placeholder="Nouvelle colonne"
            onClick={() => setIsOpen(true)}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-4 outline-none"
          />
        </DropdownToggle>
      </div>
      <DropdownMenu>
        {headersFiltered.length ? (
          headersFiltered.map((header) => (
            <DropdownItem
              key={header.field}
              onClick={() => handleChange(header.field)}
            >
              {header.label}
            </DropdownItem>
          ))
        ) : (
          <DropdownItem className="italic">Aucune colonne</DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  )
}
