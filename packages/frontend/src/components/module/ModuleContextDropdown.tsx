import { MoreDotsVertIcon } from '@/assets/icons'

type Props = {
  actions: Array<{
    label: string
    onClick: () => void
  }>
}

export default function ModuleContextDropdown({ actions }: Props) {
  return (
    <div className="dropdown dropdown-hover dropdown-left">
      <label tabIndex={0} className="btn btn-xs btn-circle bg-base-100">
        <MoreDotsVertIcon className="w-5 h-5" />
      </label>
      <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box">
        {actions.map((action, i) => (
          <li key={i}>
            <a onClick={action.onClick}>{action.label}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
