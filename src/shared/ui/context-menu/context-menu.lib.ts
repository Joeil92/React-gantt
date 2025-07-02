import { createContext, useContext } from 'react'

type ContextMenuContext = {
  isOpen: boolean
  handleOpen: (isOpen: boolean) => void
  position: { x: number; y: number }
  handlePosition: (position: { x: number; y: number }) => void
}
const ContextMenuContext = createContext<ContextMenuContext>({
  isOpen: false,
  handleOpen: () => {},
  position: { x: 0, y: 0 },
  handlePosition: () => {},
})

function useContextMenu() {
  const context = useContext(ContextMenuContext)
  if (!context)
    throw new Error('useContextMenu must be used within a ContextMenu')
  return context
}

export { ContextMenuContext, useContextMenu }
