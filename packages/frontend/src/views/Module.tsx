import {
  configuration,
  disable,
  enable,
  remove,
  resetConfiguration,
  save,
  saveConfiguration,
} from '@/api/requests/module'
import { CopyIcon, DeveloperIcon, PlayIcon, SaveIcon, StopIcon, TimeIcon, TrashIcon, VersionIcon } from '@/assets/icons'
import IconButton from '@/components/IconButton'
import Image from '@/components/Image'
import LoadingTopBar from '@/components/LoadingTopBar'
import ConfigurationEditor from '@/components/module/ConfigurationEditor'
import ConfirmConfigResetModal from '@/components/module/ConfirmConfigResetModal'
import ConfirmModuleDeleteModal from '@/components/module/ConfirmModuleDeleteModal'
import ModuleRender from '@/components/module/ModuleRender'
import { useToast } from '@/contexts/ToastContext'
import { useFetchAuth } from '@/hooks/useFetch'
import { Configuration } from '@/models/Configuration'
import type { Module } from 'models/Module'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useLiveEvents } from '@/contexts/LiveEvents'
import LazyIcon from '@/components/LazyIcon'

export default function Module() {
  const { moduleId } = useParams()
  const { tSuccess, tError } = useToast()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { source } = useLiveEvents()

  const { data, error, loading } = useFetchAuth<Module>(`/api/modules/${moduleId}`)
  const [module, setModule] = useState(data)
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false)
  const [confirmReset, setConfirmReset] = useState<boolean>(false)

  useEffect(() => {
    setModule(data)
  }, [data])

  useEffect(() => {
    if (!source || !moduleId) {
      return
    }

    const callback = (data: { subtype?: string; enabled?: boolean }) => {
      if (data.subtype !== 'status') {
        return
      }

      setModule((prev) => ({
        ...prev!,
        enabled: data.enabled ?? false,
      }))
    }

    const clear = () => {
      source.releaseModule(moduleId, callback)
    }

    window.addEventListener('beforeunload', clear)

    source.getModule(moduleId, callback)

    return () => {
      source.releaseModule(moduleId, callback)
      window.removeEventListener('beforeunload', clear)
    }
  }, [source])

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
    const req = enabled ? enable(module.id) : disable(module.id)

    req
      .then(() => {
        setModule({
          ...module,
          enabled: enabled,
        })
      })
      .catch((err) => tError(t('status.error'), err.message))
  }

  const handleSaveModule = async () => {
    await save(module)
    tSuccess(t('status.success'), t('module.feedbacks.saved_ok'))
  }

  const saveConfig = async (configuration: Configuration) => {
    saveConfiguration(module.id, configuration)
      .then(() => {
        tSuccess(t('status.success'), t('module.feedbacks.config_saved_ok'))
      })
      .catch((err) => {
        tError(t('status.error'), err.message)
      })
  }

  const handleDelete = () => {
    remove(module.id).then(() => {
      setConfirmDelete(false)
      tSuccess(t('status.success'), t('module.feedbacks.deleted_ok'))
      navigate('/modules')
    })
  }

  const handleReset = async () => {
    setConfirmReset(false)
    resetConfiguration(module.id)
      .then(async () => {
        setModule({
          ...module,
          currentConfig: await configuration(module.id),
        })
        tSuccess(t('status.success'), t('module.feedbacks.config_reset_ok'))
      })
      .catch(() => {
        tError(t('status.error'), t('module.feedbacks.config_reset_error'))
      })
  }

  const copyId = () => {
    navigator.clipboard.writeText(module.id)
    tSuccess('Copied', 'Identifier copied to your clipboard')
  }

  const iconLink = module.icon ? `/api/box/static/module/${module.id}/${module.icon}` : '/assets/module_placeholder.svg'

  return (
    <div className="flex flex-col h-full pb-20">
      <div className="hero bg-gradient-to-r from-primary to-accent shadow-inner py-10">
        <div className="hero-content flex-col lg:flex-row-reverse justify-between gap-10 backdrop-blur-xl bg-white/30 shadow-xl rounded-xl">
          <Image src={iconLink} className="w-32 lg:w-40" fallback="/assets/module_placeholder.svg" alt="module_icon" />
          <div>
            {module.nickname ? (
              <span className="text-4xl font-bold">
                {module.nickname} <span className="text-sm italic text-neutral">({module.name})</span>
              </span>
            ) : (
              <h1 className="text-4xl font-bold">{module.name}</h1>
            )}
            <p className="my-4">{module.description}</p>
            <div className="divider" />

            <div className="flex gap-2">
              <div className="badge flex items-center tooltip tooltip-bottom" data-tip="Author">
                <DeveloperIcon className="w-4 h-4 mr-2" />
                <span className="font-light">{module.author}</span>
              </div>
              <div className="badge flex items-center tooltip tooltip-bottom" data-tip="Version">
                <VersionIcon className="w-4 h-4 mr-2" />
                <span className="font-light">{module.version}</span>
              </div>
              <div className="badge flex items-center tooltip tooltip-bottom" data-tip="Importation date">
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
                <IconButton
                  onClick={() => handleChangeStatus('disable')}
                  icon={<StopIcon className="w-4 h-4" />}
                  position="left"
                  label="Stop"
                  className="btn-error"
                  keepLabel={true}
                />
              ) : (
                <IconButton
                  onClick={() => handleChangeStatus('enable')}
                  icon={<PlayIcon className="w-4 h-4" />}
                  position="left"
                  label="Start"
                  className="btn-success"
                  keepLabel={true}
                />
              )}
            </div>
          </div>
          <div className="divider"></div>
          <div>
            <label className="label">
              <span className="label-text">Requires</span>
            </label>
            <div className="flex gap-2">
              {!module.requires || module.requires.length === 0 && (
                <div className="text-neutral text-sm italic ml-6">No requirements</div>
              )}
              {module.requires &&
                module.requires.map((require) => (
                  <div className="badge badge-neutral badge-lg gap-2" key={require}>
                    <LazyIcon name={`${require}Icon`} /> {require}
                  </div>
                ))}
            </div>
          </div>

          <div className="divider"></div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Identifier</span>
            </label>
            <div className="join">
              <input
                name="id"
                type="text"
                readOnly={true}
                disabled={true}
                className="input input-bordered w-full join-item"
                value={module.id}
              />
              <button type="button" className="btn join-item flex-grow-0 bg-base-100" onClick={copyId}>
                <CopyIcon className="w-5 h-5" />
              </button>
            </div>
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
              value={module.nickname ?? ''}
              onChange={(e) => setModule({ ...module, nickname: e.target.value })}
            />
            <label className="label">
              <span className="label-text-alt text-gray-500">
                The nickname is an alternative name given to a module to make it more reconizable
              </span>
            </label>
          </div>
          <div className="flex items-center justify-end gap-2 mt-2">
            <IconButton
              onClick={() => {setConfirmDelete(true)}}
              icon={<TrashIcon className="w-4 h-4" />}
              position="left"
              label="Delete"
              className="btn-error"
              keepLabel={true}
            />

            <IconButton
              onClick={handleSaveModule}
              icon={<SaveIcon className="w-4 h-4" />}
              position="left"
              label="Save"
              className="btn-primary"
              keepLabel={true}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full items-center">
        <div className="divider text-2xl text-neutral font-bold my-6">Configuration</div>
        <div className="bg-base-100 shadow rounded-box w-full md:w-3/4 p-4">
          <ConfigurationEditor
            configuration={module.currentConfig}
            onSave={saveConfig}
            onReset={() => setConfirmReset(true)}
          />
        </div>
      </div>

      <ConfirmConfigResetModal isOpen={confirmReset} onClose={() => setConfirmReset(false)} onConfirm={handleReset} />

      <ConfirmModuleDeleteModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        module={module}
      />
    </div>
  )
}
