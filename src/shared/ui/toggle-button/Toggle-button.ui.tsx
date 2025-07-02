import { cva, type VariantProps } from 'class-variance-authority'
import type { PropsWithChildren } from 'react'

const toggleButton = cva(
  'cursor-pointer border border-grey-200 text-grey-900 py-1.5 px-2 first:rounded-s-lg not-first:border-l-0 last:rounded-e-lg focus:outline-none transition-colors',
  {
    variants: {
      isActive: {
        true: 'bg-grey-100',
        false: 'bg-white',
      },
      disabled: {
        true: 'disabled:cursor-default disabled:opacity-50',
        false: null,
      },
    },
    compoundVariants: [
      {
        isActive: false,
        disabled: false,
        className: 'hover:bg-grey-100',
      },
    ],
    defaultVariants: {
      isActive: false,
      disabled: false,
    },
  }
)

interface ToggleButtonProps
  extends Omit<
      React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
      >,
      'disabled'
    >,
    VariantProps<typeof toggleButton> {
  disabled?: boolean
  isActive?: boolean
}
export function ToggleButton({
  children,
  isActive,
  className,
  disabled,
  ...props
}: PropsWithChildren<ToggleButtonProps>) {
  return (
    <button
      className={toggleButton({ isActive, className, disabled })}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
