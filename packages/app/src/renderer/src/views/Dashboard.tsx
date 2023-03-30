import { useEffect, useState } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client';
import ModuleCard from '../components/ModuleCard'

export default function Dashboard() {
  const [modules, setModules] = useState<any[]>([])

  const loadModule = async () => {
    const modules = await window.api.test()
    setModules(modules)
    const Render = await window.api.getModuleRender('1')

    console.log(Render)

    const zone = document.getElementById('testModule')!
    console.log(Render)
    // zone.render(<div dangerouslySetInnerHTML={{ __html: Render }}></div>)

    hydrateRoot(document, <Render />)

    // zone.render(<Render />)

    // ReactDOM.hydrate(React.createElement(render), document.getElementById('testModule'));
  }

  useEffect(() => {
    // Load modules
    loadModule()
  }, [])

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div id="testModule" className="bg-red-100"></div>
      <h1 className="font-bold">test</h1>
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-8 items-center">
        {modules.map((module, i) => (
          <ModuleCard key={i} title={module.name} description={module.description} />
        ))}
      </div>
    </div>
  )
}
