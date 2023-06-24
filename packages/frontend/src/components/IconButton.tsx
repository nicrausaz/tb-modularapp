import { Link } from 'react-router-dom'

type IconButtonProps = {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  className?: string
  disabled?: boolean
  position: 'left' | 'right'
  color?: string
  asLink?: boolean
  to?: string
  target?: string
  type?: 'button' | 'submit' | 'reset'
  keepLabel?: boolean
}

/**
 * A wrapper around the <button> tag that allows for an icon to be used as the button's content.
 * On mobile, the label cab hidden and the icon will be used as the button's label.
 */
export default function IconButton({
  icon,
  label,
  onClick,
  className,
  disabled,
  position,
  asLink,
  to,
  target,
  type = 'button',
  keepLabel = false,
}: IconButtonProps) {
  const contentCls = `flex items-center space-x-2 ${keepLabel ? '' : 'hidden md:inline'}`
  const content = (
    <>
      {position === 'left' && icon}
      <span className={contentCls}>{label}</span>
      {position === 'right' && icon}
    </>
  )

  const cls = `btn ${className ?? ''}`

  if (asLink) {
    return (
      <Link to={to ?? '#'} className={cls} onClick={onClick} target={target}>
        {content}
      </Link>
    )
  }

  return (
    <button className={cls} onClick={onClick} disabled={disabled} type={type}>
      {content}
    </button>
  )
}
