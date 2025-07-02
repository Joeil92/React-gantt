import { cva, type VariantProps } from 'class-variance-authority'
import { type HTMLAttributes } from 'react'

const typography = cva('', {
  variants: {
    tag: {
      small: 'text-[12px] leading-[16px]',
      span: 'text-[16px] leading-[24px]',
      subtitle: 'text-[18px] leading-[28px] font-semibold',
      h1: 'text-5xl leading-[58px] font-semibold',
      h2: 'text-[40px] leading-[48px] font-semibold',
      h3: 'text-[32px] leading-[38px] font-semibold',
      h4: 'text-[28px] leading-[34px] font-semibold',
      h5: 'text-[24px] leading-[28px] font-semibold',
      p: 'text-[16px] leading-[24px]',
    },
  },
})

export interface TypographyProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof typography> {}

export function Typography({
  tag = 'p',
  className,
  children,
  ...props
}: TypographyProps) {
  return (
    (tag === 'small' && (
      <small className={typography({ tag, className })} {...props}>
        {children}
      </small>
    )) ||
    (tag === 'span' && (
      <span className={typography({ tag, className })} {...props}>
        {children}
      </span>
    )) ||
    (tag === 'h1' && (
      <h1 className={typography({ tag, className })} {...props}>
        {children}
      </h1>
    )) ||
    (tag === 'h2' && (
      <h2 className={typography({ tag, className })} {...props}>
        {children}
      </h2>
    )) ||
    (tag === 'h3' && (
      <h3 className={typography({ tag, className })} {...props}>
        {children}
      </h3>
    )) ||
    (tag === 'h4' && (
      <h4 className={typography({ tag, className })} {...props}>
        {children}
      </h4>
    )) ||
    (tag === 'h5' && (
      <h5 className={typography({ tag, className })} {...props}>
        {children}
      </h5>
    )) || (
      <p className={typography({ tag, className })} {...props}>
        {children}
      </p>
    )
  )
}
