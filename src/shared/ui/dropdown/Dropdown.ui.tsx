import clsx from 'clsx'
import { useEffect, useRef, useState, type PropsWithChildren } from 'react'
import { DropdownContext, useDropdown } from './dropdown.lib'

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean
}
function Dropdown({
  defaultOpen,
  children,
  className,
  ...props
}: PropsWithChildren<DropdownProps>) {
  const [isOpen, setIsOpen] = useState(defaultOpen || false)
  const ref = useRef<HTMLDivElement>(null)

  const toggle = () => {
    setIsOpen(defaultOpen || !isOpen)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <DropdownContext value={{ isOpen, toggle }}>
      <div className={clsx('relative', className)} ref={ref} {...props}>
        {children}
      </div>
    </DropdownContext>
  )
}

function DropdownToggle({ children }: PropsWithChildren) {
  const { toggle } = useDropdown()

  return <div onClick={toggle}>{children}</div>
}

function DropdownMenu({ children }: PropsWithChildren) {
  const { isOpen } = useDropdown()

  return (
    <ul
      className={clsx(
        'absolute z-10 w-full bg-white py-4 shadow-sm',
        !isOpen && 'hidden'
      )}
    >
      {children}
    </ul>
  )
}

interface DropdownItemProps
  extends React.DetailedHTMLProps<
    React.LiHTMLAttributes<HTMLLIElement>,
    HTMLLIElement
  > {
  children: React.ReactNode
}
function DropdownItem({
  children,
  className,
  ...props
}: PropsWithChildren<DropdownItemProps>) {
  return (
    <li
      className={clsx(
        'text-smoutline-none hover:bg-grey-100 relative flex cursor-pointer items-center rounded-sm px-4 py-1.5 transition-colors select-none',
        className
      )}
      {...props}
    >
      {children}
    </li>
  )
}

export { Dropdown, DropdownToggle, DropdownMenu, DropdownItem }
