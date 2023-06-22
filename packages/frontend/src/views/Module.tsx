import fetcher from '@/api/fetcher'
import { DeveloperIcon, TimeIcon, VersionIcon } from '@/assets/icons'
import LoadingTopBar from '@/components/LoadingTopBar'
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
    return <LoadingTopBar />
  }

  if (error) {
    throw error
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

  const handleSaveModule = async () => {
    fetcher(`/api/modules/${module.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nickname: module.nickname,
      }),
    })
    tSuccess('Module saved', 'The module has been saved successfully')
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

  const iconLink = module.icon ? `/api/box/static/module/${module.id}/${module.icon}` : '/assets/module_placeholder.svg'

  return (
    <div className="flex flex-col h-full pb-20">
      <div className="hero bg-gradient-to-r from-primary to-accent shadow-inner py-10">
        <div className="hero-content flex-col lg:flex-row-reverse justify-between gap-10">
          <img className="mask w-32 lg:w-40" src={iconLink} />
          {/* {module.icon} */}
          <div className=" ">
            {module.nickname ? (
              <span className="text-4xl font-bold">
                {module.nickname} <span className="text-sm italic text-neutral">({module.name})</span>
              </span>
            ) : (
              <h1 className="text-4xl font-bold">{module.name}</h1>
            )}
            <p className="py-6">{module.description}</p>
            <div className="flex justify-between bg-base-200 italic rounded-lg px-2 py-1 shadow-inner gap-4">
              <div className="flex items-center tooltip tooltip-bottom" data-tip="Author">
                <DeveloperIcon className="w-4 h-4 mr-2" />
                <span className="font-light">{module.author}</span>
              </div>
              <div className="flex items-center tooltip tooltip-bottom" data-tip="Version">
                <VersionIcon className="w-4 h-4 mr-2" />
                <span className="font-light">{module.version}</span>
              </div>
              <div className="flex items-center tooltip tooltip-bottom" data-tip="Import date">
                <TimeIcon className="w-4 h-4 mr-2" />
                <span className="font-light">{module.importedAt.toString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full items-center mb-4">
        <div className="divider text-2xl text-neutral font-bold mb-6">Actions & informations</div>

        <div className="shadow rounded-box w-full md:w-3/4 p-4">
          <div className="flex flex-col w-full lg:flex-row">
            <div className="grid flex-grow card rounded-box place-items-center border-2 border-dotted">
              {module.enabled ? <ModuleRender id={module.id} /> : <p>Activate module to see the preview</p>}
            </div>
            <div className="divider divider-horizontal p-1"></div>
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
          <div className="divider"></div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Identifier</span>
            </label>
            <input
              name="id"
              type="text"
              readOnly={true}
              disabled={true}
              className="input input-bordered w-full"
              value={module.id}
            />
            <label className="label">
              <span className="label-text-alt text-gray-500">
                The identifier can be used to interact with the module through the API
              </span>
            </label>
            <label className="label">
              <span className="label-text">Nickname</span>
            </label>
            <input
              name="nickname"
              type="text"
              placeholder="Enter module nickname"
              className="input input-bordered w-full"
              value={module.nickname}
              onChange={(e) => setModule({ ...module, nickname: e.target.value })}
            />
            <label className="label">
              <span className="label-text-alt text-gray-500">
                The nickname is an alternative name given to a module to make it more reconizable
              </span>
            </label>
          </div>
          <div className="flex items-center justify-end gap-2 mt-2">
            <button className="btn btn-primary" onClick={handleSaveModule}>
              Save
            </button>
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
