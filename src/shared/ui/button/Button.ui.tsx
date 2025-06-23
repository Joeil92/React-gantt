import { cva, type VariantProps } from 'class-variance-authority'
import { type ButtonHTMLAttributes } from 'react'

const button = cva('px-4 py-3 rounded-md text-[14px] font-semibold', {
  variants: {
    variant: {
      primary: 'bg-primary-500 text-white',
      'primary-outline':
        'bg-transparent text-primary-500 border border-primary-500',
      success: 'bg-success-500 text-white',
      'success-outline':
        'bg-transparent text-success-500 border border-success-500',
      warning: 'bg-warning-500 text-white',
      'warning-outline':
        'bg-transparent text-warning-500 border border-warning-500',
      info: 'bg-info-500 text-white',
      'info-outline': 'bg-transparent text-info-500 border border-info-500',
      danger: 'bg-danger-500 text-white',
      'danger-outline':
        'bg-transparent text-danger-500 border border-danger-500',
    },
    disabled: {
      true: 'cursor-not-allowed opacity-50',
      false: null,
    },
  },
  defaultVariants: {
    variant: 'primary',
    disabled: false,
  },
  compoundVariants: [
    {
      variant: ['primary', 'primary-outline'],
      disabled: false,
      className:
        'cursor-pointer hover:bg-primary-600 active:bg-primary-800 hover:text-white',
    },
    {
      variant: ['success', 'success-outline'],
      disabled: false,
      className:
        'cursor-pointer hover:bg-success-600 active:bg-success-800 hover:text-white',
    },
    {
      variant: ['warning', 'warning-outline'],
      disabled: false,
      className:
        'cursor-pointer hover:bg-warning-600 active:bg-warning-800 hover:text-white',
    },
    {
      variant: ['info', 'info-outline'],
      disabled: false,
      className:
        'cursor-pointer hover:bg-info-600 active:bg-info-800 hover:text-white',
    },
    {
      variant: ['danger', 'danger-outline'],
      disabled: false,
      className:
        'cursor-pointer hover:bg-danger-600 active:bg-danger-800 hover:text-white',
    },
  ],
})

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>,
    VariantProps<typeof button> {}

export function Button({
  children,
  variant,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={button({ variant, disabled, className })}
      disabled={!!disabled}
      {...props}
    >
      {children}
    </button>
  )
}
