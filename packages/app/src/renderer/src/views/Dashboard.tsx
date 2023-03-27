import { useState } from 'react'

export default function Dashboard() {
  const [modules, setModules] = useState<any[]>([])

  const test = async () => {
    const modules = await window.api.test()
    console.log('test', modules)
    setModules(modules)
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <button className='btn' onClick={test}>Load</button>
      List of modules:
      <ul>
        {modules.map((module) => (
          <li key={module.name}>
            {module.name} ({module.version}) - {module.description}
          </li>
        ))}
      </ul>
    </div>
  )
}
