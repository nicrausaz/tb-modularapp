type Props = {
  actions: Array<{
    label: string
    onClick: () => void
  }>
}

export default function ModuleContextDropdown({ actions }: Props) {
  return (
    <div className="dropdown dropdown-hover dropdown-left">
      <label tabIndex={0} className="btn btn-xs btn-circle ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </label>
      <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
        {actions.map((action, i) => (
          <li key={i}>
            <a onClick={action.onClick}>{action.label}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
