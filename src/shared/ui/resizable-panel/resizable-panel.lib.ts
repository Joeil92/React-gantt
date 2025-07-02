import { createContext, useContext } from 'react'

type ResizablePanelContextType = {
  direction?: 'horizontal' | 'vertical'
  size: number
  onChangeSize: (size: number) => void
}
const ResizablePanelContext = createContext<ResizablePanelContextType>({
  direction: 'horizontal',
  size: 0,
  onChangeSize: () => {},
})

function useResizablePanelContext() {
  const context = useContext(ResizablePanelContext)
  if (!context)
    throw new Error(
      'useResizablePanelContext must be used within a ResizablePanel'
    )
  return context
}

export { ResizablePanelContext, useResizablePanelContext }
