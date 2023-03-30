import { useEffect, useState } from 'react'
import ModuleCard from '../components/ModuleCard'

export default function Dashboard() {
  const [modules, setModules] = useState<any[]>([])

  const [counter, setCounter] = useState(0)

  // ipcRenderer.on('test', (event, arg) => {
  //   const counter = document.getElementById('count')!
  //   counter.innerHTML = arg
  // })

  const test = async () => {
    window.api.onUpdateCounter((event, value) => {
      setCounter(value)
    })
  }

  const loadModule = async () => {
    // const modules = await window.api.test()
    // setModules(modules)
  }

  useEffect(() => {
    // Load modules
    loadModule()
    test()
  }, [])

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div id="testModule" className="bg-red-100">
        <h1>counter</h1>
        <span id="count">{counter}</span>
      </div>
      <h1 className="font-bold">test</h1>
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-8 items-center">
        {modules.map((module, i) => (
          <ModuleCard key={i} title={module.name} description={module.description} />
        ))}
      </div>
    </div>
  )
}
