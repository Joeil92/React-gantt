import { useEffect, useRef, useState } from 'react'
import { ContextMenuContext, useContextMenu } from './context-menu.lib'
import clsx from 'clsx'

function ContextMenu({ children }: React.PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [containerRef])

  return (
    <ContextMenuContext
      value={{
        isOpen,
        handleOpen: setIsOpen,
        position,
        handlePosition: setPosition,
      }}
    >
      <div ref={containerRef} className="relative">
        {children}
      </div>
    </ContextMenuContext>
  )
}

function ContextMenuToggle({
  children,
  ...props
}: React.PropsWithChildren<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>) {
  const { handleOpen, handlePosition } = useContextMenu()

  const handleContextMenu = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault()
    handleOpen(true)
    handlePosition({ x: e.clientX, y: e.clientY })
  }

  return (
    <div onContextMenu={handleContextMenu} {...props}>
      {children}
    </div>
  )
}

function ContextMenuList({ children }: React.PropsWithChildren) {
  const { isOpen, position } = useContextMenu()

  if (!isOpen) return null

  return (
    <ul
      className="fixed z-50 flex-row gap-4 rounded-sm bg-white py-4 shadow-sm"
      style={{ top: position.y, left: position.x }}
    >
      {children}
    </ul>
  )
}

function ContextMenuItem({
  children,
  onClick,
  className,
  ...props
}: React.PropsWithChildren<
  React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>
>) {
  const { isOpen, handleOpen } = useContextMenu()

  if (!isOpen) return null

  const handleClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    e.preventDefault()
    onClick?.(e)
    handleOpen(false)
  }

  return (
    <li
      className={clsx(
        'text-smoutline-none hover:bg-grey-100 relative flex cursor-pointer items-center gap-4 rounded-sm px-4 py-1.5 transition-colors select-none',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </li>
  )
}

function ContextMenuDivider() {
  return <hr className="border-grey-200 my-1.5" />
}

export {
  ContextMenu,
  ContextMenuToggle,
  ContextMenuList,
  ContextMenuItem,
  ContextMenuDivider,
}
