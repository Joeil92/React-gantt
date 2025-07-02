import { cva, type VariantProps } from 'class-variance-authority'
import type { TableHTMLAttributes, ThHTMLAttributes } from 'react'

interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode
}
const table = cva('w-full border-collapse')
function Table({ children, className, ...props }: TableProps) {
  return (
    <table {...props} className={table({ className })}>
      {children}
    </table>
  )
}

interface TableHeaderProps
  extends TableHTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode
}
function TableHeader({ children, ...props }: TableHeaderProps) {
  return <thead {...props}>{children}</thead>
}

interface TableHeadProps
  extends Omit<
      React.DetailedHTMLProps<
        ThHTMLAttributes<HTMLTableHeaderCellElement>,
        HTMLTableHeaderCellElement
      >,
      'align'
    >,
    VariantProps<typeof tableHead> {
  children: React.ReactNode
}
const tableHead = cva(
  'p-4 border-y first:border-s last:border-e border-grey-100 font-semibold text-[16px] leading-[24px]',
  {
    variants: {
      align: {
        start: 'text-start',
        center: 'text-center',
        end: 'text-end',
      },
    },
    defaultVariants: {
      align: 'start',
    },
  }
)
function TableHead({ children, align, className, ...props }: TableHeadProps) {
  return (
    <th {...props} className={tableHead({ align, className })}>
      {children}
    </th>
  )
}

interface TableBodyProps extends TableHTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode
}
function TableBody({ children, ...props }: TableBodyProps) {
  return <tbody {...props}>{children}</tbody>
}

interface TableRowProps extends TableHTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode
}
function TableRow({ children, ...props }: TableRowProps) {
  return (
    <tr
      {...props}
      className="hover:bg-grey-100 transition-colors duration-200 ease-in-out"
    >
      {children}
    </tr>
  )
}

interface TableCellProps extends TableHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
}
const tableCell = cva('p-4 border-0 text-[16px] leading-[24px]')
function TableCell({ children, className, ...props }: TableCellProps) {
  return (
    <td {...props} className={tableCell({ className })}>
      {children}
    </td>
  )
}

export { Table, TableHeader, TableHead, TableBody, TableRow, TableCell }
