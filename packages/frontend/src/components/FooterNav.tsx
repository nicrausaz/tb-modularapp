import { Link } from 'react-router-dom'

import Icon from './Icon'

type Link = {
  to: string
  icon: string
  label: string
}

type FooterProps = {
  links: Link[]
  active: string
}

export default function FooterNav({ links, active }: FooterProps) {
  const isActive = (link: Link) => {
    return link.to === active
  }

  return (
    <div className="btm-nav btm-nav-sm border">
      {links.map((link, i) => (
        <Link to={link.to} className={isActive(link) ? 'text-primary active' : ''} key={i}>
          <Icon name={link.icon} />
          <span className="btm-nav-label">{link.label}</span>
        </Link>
      ))}
    </div>
  )
}
