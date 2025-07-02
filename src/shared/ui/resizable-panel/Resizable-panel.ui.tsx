import clsx from 'clsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Children,
  cloneElement,
  isValidElement,
  useState,
  type CSSProperties,
  type PropsWithChildren,
  type ReactElement,
} from 'react'
import {
  ResizablePanelContext,
  useResizablePanelContext,
} from './resizable-panel.lib'

interface ResizablePanelGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'horizontal' | 'vertical'
}
function ResizablePanelGroup({
  children,
  direction = 'horizontal',
  className,
  ...props
}: PropsWithChildren<ResizablePanelGroupProps>) {
  const [panelWidth, setPanelWidth] = useState(50)

  const modifiedChildren = Children.map(children, (child, index) => {
    if (isValidElement(child) && child.type === ResizablePanel) {
      return cloneElement(child as ReactElement<ResizablePanelProps>, { index })
    }
    return child
  })

  return (
    <ResizablePanelContext
      value={{ direction, size: panelWidth, onChangeSize: setPanelWidth }}
    >
      <div
        className={clsx(
          'flex items-stretch',
          direction === 'horizontal' ? 'flex-row' : 'flex-col',
          className
        )}
        {...props}
      >
        {modifiedChildren}
      </div>
    </ResizablePanelContext>
  )
}

interface ResizablePanelProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  index?: number
  minWidth?: number
  minHeight?: number
}
function ResizablePanel({
  children,
  index,
  minWidth,
  minHeight,
  className,
  ...props
}: PropsWithChildren<ResizablePanelProps>) {
  const { direction, size } = useResizablePanelContext()
  const isHorizontal = direction === 'horizontal'

  if (index === undefined) return null

  if (index > 2)
    throw new Error('ResizablePanel can only have a maximum of 2 children')

  const style: CSSProperties = {
    width:
      isHorizontal && !index ? `${Math.max(size, minWidth || 0)}%` : undefined,
    minWidth: `${minWidth || 0}%`,
    height:
      !isHorizontal && !index
        ? `${Math.max(size, minHeight || 0)}%`
        : undefined,
    minHeight: `${minHeight || 0}%`,
    flex: index !== 0 ? 1 : undefined,
  }

  return (
    <div
      className={clsx('overflow-hidden transition-all duration-100', className)}
      style={style}
      {...props}
    >
      {children}
    </div>
  )
}

function ResizablePanelHandle() {
  const { direction, onChangeSize } = useResizablePanelContext()
  const isHorizontal = direction === 'horizontal'

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget.parentElement
    if (!container) return

    document.body.style.userSelect = 'none'

    const moveListener = (ev: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const offset = isHorizontal
        ? ev.clientX - rect.left
        : ev.clientY - rect.top
      const fullSize = isHorizontal ? rect.width : rect.height
      const percent = Math.round((offset / fullSize) * 100)
      onChangeSize(percent)
    }

    const upListener = () => {
      document.removeEventListener('mousemove', moveListener)
      document.removeEventListener('mouseup', upListener)

      document.body.style.userSelect = ''
    }

    document.addEventListener('mousemove', moveListener)
    document.addEventListener('mouseup', upListener)
  }

  const onChangeMaxSize = () => {
    onChangeSize(100)
  }

  const onChangeMinSize = () => {
    onChangeSize(0)
  }

  return (
    <div
      className={clsx(
        'bg-grey-100 border-grey-200 relative z-10 border',
        isHorizontal ? 'w-2 cursor-col-resize' : 'h-2 cursor-row-resize'
      )}
      onMouseDown={onMouseDown}
    >
      <div
        className={clsx(
          'bg-grey-100 border-grey-200 absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 transform cursor-default items-center justify-center rounded-full border p-1.5',
          isHorizontal ? 'top-1/2 left-1 flex-row' : 'top-1 left-1/2 flex-col'
        )}
      >
        {isHorizontal ? (
          <>
            <ChevronLeft
              className="hover:text-primary-300 h-4 w-4 text-gray-500"
              onClick={onChangeMinSize}
            />
            <ChevronRight
              className="hover:text-primary-300 h-4 w-4 text-gray-500"
              onClick={onChangeMaxSize}
            />
          </>
        ) : (
          <>
            <ChevronLeft
              className="hover:text-primary-300 h-4 w-4 rotate-90 text-gray-500"
              onClick={onChangeMinSize}
            />
            <ChevronRight
              className="hover:text-primary-300 h-4 w-4 rotate-90 text-gray-500"
              onClick={onChangeMaxSize}
            />
          </>
        )}
      </div>
    </div>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizablePanelHandle }
