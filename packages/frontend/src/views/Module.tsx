import fetcher from '@/api/fetcher'
import ConfigurationEditor from '@/components/module/ConfigurationEditor'
import ModuleRender from '@/components/module/ModuleRender'
import { useToast } from '@/contexts/ToastContext'
import { useFetchAuth } from '@/hooks/useFetch'
import { Configuration } from '@/models/Configuration'
import type { Module } from 'models/Module'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function Module() {
  const { moduleId } = useParams()
  const { tSuccess, tError } = useToast()

  const { data, error, loading } = useFetchAuth<Module>(`/api/modules/${moduleId}`)
  const [module, setModule] = useState(data)

  useEffect(() => {
    setModule(data)
  }, [data])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (!module) {
    return <div>Module not found</div>
  }

  const handleChangeStatus = async (action: string) => {
    const enabled = action === 'enable'

    await fetcher(`/api/modules/${module.id}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        enabled: enabled,
      }),
    })

    setModule({
      ...module,
      enabled: enabled,
    })
  }

  const saveConfiguration = async (configuration: Configuration) => {
    fetcher(`/api/modules/${module.id}/configuration`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: configuration,
      }),
    })
      .then((res) => {
        console.log(res)
        tSuccess('Configuration saved', 'The configuration has been saved successfully')
      })
      .catch((err) => {
        tError('Error', err.message)
      })
  }

  return (
    <div className="flex flex-col h-full pb-20">
      <div className="hero">
        <div className="hero-content flex-col lg:flex-row-reverse justify-between">
          <img
            className="mask mask-squircle w-40 lg:w-60 shadow-2xl"
            src="https://daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.jpg"
          />
          <div>
            <h1 className="text-5xl font-bold">{module.name}</h1>
            <p className="py-6">{module.description}</p>
            <div className="flex justify-between">
              <div>
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" />
                <p className="font-bold">{module.author}</p>
              </div>
              <div>
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" />
                <p className="font-bold">{module.version}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full items-center mb-4">
        <div className="divider text-2xl text-neutral font-bold mb-6">Actions</div>

        <div className="shadow rounded-box w-full md:w-3/4 p-4">
          <div className="flex flex-col w-full lg:flex-row">
            <div className="grid flex-grow card rounded-box place-items-center border-2 border-dotted">
              {module.enabled ? <ModuleRender id={module.id} /> : <p>Activate module to see the preview</p>}
            </div>
            <div className="divider divider-horizontal"></div>
            <div className="grid card rounded-box place-items-center">
              {module.enabled ? (
                <button className="btn btn-error" onClick={() => handleChangeStatus('disabled')}>
                  Stop
                </button>
              ) : (
                <button className="btn btn-success" onClick={() => handleChangeStatus('enable')}>
                  Start
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full items-center">
        <div className="divider text-2xl text-neutral font-bold my-6">Configuration</div>
        <div className="bg-base-100 shadow rounded-box w-full md:w-3/4 p-4">
          <ConfigurationEditor configuration={module.currentConfig} onSave={saveConfiguration} />
        </div>
      </div>
    </div>
  )
}
