import { Link } from 'react-router-dom'
import ModuleContextDropdown from './ModuleContextDropdown'

type ModuleCardProps = {
  id: string
  title: string
  description: string
  active: boolean
}

export default function ModuleCard({ id, title, description, active }: ModuleCardProps) {
  const actions = [
    {
      label: 'Enable',
      onClick: () => {
        console.log('Enable')
      },
    },
    {
      label: 'Disable',
      onClick: () => {
        console.log('Disable')
      },
    },
  ]

  return (
    <div className="card card-side bg-base-200 shadow-xl">
      <Link to={`/modules/${id}`}>
        <div className="card-body flex flex-row items-center gap-4" title={description}>
          <img
            className="mask mask-squircle"
            src="https://daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.jpg"
            width={100}
            height={100}
          />
          <div>
            <h2 className="card-title">{title}</h2>
            <p>{description}</p>
            <div className="card-actions justify-end">
              {/* <button className="btn btn-primary">Enable | Disable</button> */}
            </div>
          </div>
          <div></div>
        </div>
      </Link>
      <div>
        <div className="card-actions justify-end translate-x-2 -translate-y-2">
          <ModuleContextDropdown actions={actions} />
        </div>
      </div>
    </div>
  )
}
