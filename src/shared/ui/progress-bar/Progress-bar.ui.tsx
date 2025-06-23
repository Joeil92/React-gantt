import { cva, type VariantProps } from 'class-variance-authority'

const progressBar = cva('rounded-full bg-grey-200 flex-1', {
  variants: {
    size: {
      sm: 'h-3',
      md: 'h-5',
      lg: 'h-7',
    },
    rounded: {
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    },
  },
  defaultVariants: {
    size: 'md',
    rounded: 'md',
  },
})

const progressionStyle = cva('', {
  variants: {
    variant: {
      default: 'bg-primary-500',
      success: 'bg-success-500',
      warning: 'bg-warning-500',
      danger: 'bg-danger-500',
    },
    size: {
      sm: 'h-3',
      md: 'h-5',
      lg: 'h-7',
    },
    rounded: {
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    rounded: 'md',
  },
})

interface ProgressBarProps
  extends React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >,
    VariantProps<typeof progressBar>,
    VariantProps<typeof progressionStyle> {
  progression?: number
  displayValue?: boolean
}
export function ProgressBar({
  progression = 0,
  displayValue = false,
  className,
  variant,
  size,
  rounded,
  ...props
}: ProgressBarProps) {
  return (
    <div className="flex items-center justify-start gap-4">
      <div className={progressBar({ size, rounded, className })} {...props}>
        <div
          className={progressionStyle({ variant, size, rounded })}
          style={{ width: `${progression}%` }}
        />
      </div>
      {displayValue && <span className="text-xs">{progression}%</span>}
    </div>
  )
}
