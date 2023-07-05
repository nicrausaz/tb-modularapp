type Props = {
  icon: React.ReactNode
  actions: Array<{
    label: string
    onClick: () => void
  }>
}

export default function ContextDropdown({ actions, icon }: Props) {
  return (
    <div className="dropdown dropdown-hover dropdown-left">
      <label tabIndex={0} className="btn btn-xs btn-circle bg-base-100">
        {icon}
      </label>
      <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box z-10">
        {actions.map((action, i) => (
          <li key={i}>
            <a onClick={action.onClick}>{action.label}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
