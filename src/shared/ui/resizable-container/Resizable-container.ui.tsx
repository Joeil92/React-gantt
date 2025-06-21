import clsx from 'clsx'
import { useRef, type PropsWithChildren } from 'react'

interface ResizableContainerProps
  extends Omit<
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >,
    'className'
  > {
  direction?: 'horizontal' | 'vertical'
  minWidth?: number
  minHeight?: number
  containerClassName?: string
  childrenClassName?: string
}
export function ResizableContainer({
  children,
  direction = 'vertical',
  minWidth = 10,
  minHeight = 10,
  containerClassName,
  childrenClassName,
  ...props
}: PropsWithChildren<ResizableContainerProps>) {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!containerRef.current) return

    document.body.style.userSelect = 'none'

    const element = containerRef.current

    const startX = e.clientX
    const startY = e.clientY
    const { width: startWidth, height: startHeight } =
      element.getBoundingClientRect()

    const handleMouseMove = (e: MouseEvent) => {
      if (direction === 'vertical') {
        const newWidth = Math.max(minWidth, startWidth + (e.clientX - startX))
        element.style.width = `${newWidth}px`
      } else {
        const newHeight = Math.max(
          minHeight,
          startHeight + (e.clientY - startY)
        )
        element.style.height = `${newHeight}px`
      }
    }

    const handleMouseUp = () => {
      document.body.style.userSelect = 'auto'

      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mousemove', handleMouseMove)
    }

    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mousemove', handleMouseMove)
  }

  return (
    <div
      {...props}
      className={clsx('relative overflow-hidden', containerClassName)}
      ref={containerRef}
    >
      <div className={childrenClassName}>{children}</div>
      {direction === 'vertical' ? (
        <div
          className={'absolute right-0 bottom-0 h-full w-1 cursor-col-resize'}
          onMouseDown={handleMouseDown}
        />
      ) : null}
      {direction === 'horizontal' ? (
        <div
          className={'absolute bottom-0 left-0 h-1 w-full cursor-row-resize'}
          onMouseDown={handleMouseDown}
        />
      ) : null}
    </div>
  )
}
