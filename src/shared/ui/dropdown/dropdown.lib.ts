import { createContext, useContext } from 'react'

type DropdownContext = {
  isOpen: boolean
  toggle: () => void
}
const DropdownContext = createContext<DropdownContext>({
  isOpen: false,
  toggle: () => {},
})

function useDropdown() {
  const context = useContext(DropdownContext)
  if (!context) throw new Error('useDropdown must be used within a Dropdown')
  return context
}

export { DropdownContext, useDropdown }
