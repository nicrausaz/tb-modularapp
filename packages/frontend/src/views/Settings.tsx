import FilePreviewerInput from '@/components/FilePreviewerInput'
import Input from '@/components/Input'
import LoadingTopBar from '@/components/LoadingTopBar'
import LanguagePicker from '@/components/settings/LanguagePicker'
import ThemePicker from '@/components/settings/ThemePicker'
import UsersList from '@/components/users/UsersList'
import { useFetchAuth } from '@/hooks/useFetch'
import { User } from '@/models/User'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/contexts/ToastContext'
import Image from '@/components/Image'
import { useBox } from '@/contexts/BoxContext'
import { getAll } from '@/api/requests/users'
import IconButton from '@/components/IconButton'
import { DocsIcon, GitHubIcon, SaveIcon, WebIcon } from '@/assets/icons'
import APIKeysList from '@/components/settings/APIKeysList'
import { APIKey } from '@/models/Box'
import { getAPIKeys } from '@/api/requests/box'

export default function Settings() {
  const { data, loading, error } = useFetchAuth<User[]>('/api/users')
  const { data: keysData, loading: keysLoading, error: keysError } = useFetchAuth<APIKey[]>('/api/box/security/keys')
  const { box, updateIcon, updateBox } = useBox()

  const [users, setUsers] = useState<User[]>([])
  const [APIKeys, setAPIKeys] = useState<APIKey[]>([])
  const { t } = useTranslation()
  const { tSuccess } = useToast()

  const [editingBox, setEditingBox] = useState({
    name: box?.name || '',
  })

  useEffect(() => {
    if (data) {
      setUsers(data)
    }
  }, [data])

  useEffect(() => {
    if (keysData) {
      setAPIKeys(keysData)
    }
  }, [keysData])

  if (loading || keysLoading) {
    return <LoadingTopBar />
  }

  if (error || keysError) {
    throw error
  }

  if (!box || !users) {
    return null
  }

  const refreshUsers = async () => {
    const data = await getAll()
    if (data) {
      setUsers(data)
    }
  }

  const refreshAPIKey = async () => {
    const data = await getAPIKeys()
    if (data) {
      setAPIKeys(data)
    }
  }

  const uploadBoxIcon = async (file: File) => {
    updateIcon(file)
    tSuccess(t('status.success'), t('settings.feedbacks.icon_saved_ok'))
  }

  const update = async () => {
    updateBox(editingBox.name)
    tSuccess(t('status.success'), t('settings.feedbacks.box_saved_ok'))
  }

  return (
    <div className="flex flex-col w-full items-center pb-20">
      <div className="hero bg-gradient-to-r from-primary to-accent p-10 ">
        <div className="hero-content flex-col lg:flex-row justify-between backdrop-blur-xl bg-white/30 shadow-xl rounded-xl min-w-full lg:min-w-fit">
          <Image
            src={`/api/box/static/${box.icon}`}
            alt="Box icon"
            fallback="/assets/logo.svg"
            className="w-20 lg:w-36"
          />
          <div>
            <h1 className="text-4xl font-bold">{box.name}</h1>
            <div>
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" />
              <span className="font-bold float-right">
                <div className="badge">v{box.version}</div>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full items-center">
        <div className="divider text-2xl text-neutral font-bold my-6">{t('settings.preferences.title')}</div>
        <div className="bg-base-100 shadow rounded-box w-full md:w-3/4 p-4">
          <label className="label">
            <span className="label-text">{t('settings.preferences.theme')}</span>
          </label>
          <ThemePicker />

          <label className="label">
            <span className="label-text">{t('settings.preferences.language')}</span>
          </label>
          <LanguagePicker />
        </div>
      </div>

      <div className="flex flex-col w-full items-center">
        <div className="divider text-2xl text-neutral font-bold my-6">{t('settings.configuration.title')}</div>
        <div className="bg-base-100 shadow rounded-box w-full md:w-3/4 p-4">
          <Input
            label={t('settings.configuration.name')}
            placeholder="My box"
            onChange={(value) => setEditingBox({ ...editingBox, name: value })}
            name="boxname"
            value={editingBox.name}
          />

          <label className="label">
            <span className="label-text">{t('settings.configuration.image')}</span>
          </label>

          <FilePreviewerInput
            onUpload={uploadBoxIcon}
            currentPicture={`/api/box/static/${box.icon}`}
            placeholder="assets/logo.svg"
            rounded={false}
            className="h-20 w-20"
          />

          <div className="flex items-center justify-end gap-2 mt-2">
            <IconButton
              onClick={update}
              icon={<SaveIcon className="w-4 h-4" />}
              position="left"
              label={t('settings.configuration.save')}
              className="btn-primary"
              keepLabel={true}
            />
          </div>

          <div className="divider"></div>

          <UsersList users={users} onUpdated={refreshUsers} />

          <div className="divider"></div>

          <APIKeysList keys={APIKeys} onUpdated={refreshAPIKey} />
        </div>
      </div>

      <div className="flex flex-col w-full items-center">
        <div className="divider text-2xl text-neutral font-bold my-6">Others</div>

        <div className="bg-base-100 shadow rounded-box w-full md:w-3/4 p-4 flex items-center justify-between">
          <IconButton
            icon={<DocsIcon className="w-6 h-6" />}
            asLink={true}
            to="http://localhost:3000/api-docs"
            className="btn-link"
            label="API Documentation"
            position="left"
            target="_blank"
          />
          <IconButton
            icon={<GitHubIcon className="w-6 h-6" />}
            asLink={true}
            to="https://github.com/nicrausaz/tb-modularapp"
            className="btn-link"
            label="Github"
            position="left"
            target="_blank"
          />
          <IconButton
            icon={<WebIcon className="w-6 h-6" />}
            asLink={true}
            to="https://example.com"
            className="btn-link"
            label="Website"
            position="left"
            target="_blank"
            disabled={true}
          />

          <IconButton
            icon={<img src="/assets/logo.svg" className="w-6 h-6" />}
            asLink={true}
            to="/about"
            className="btn-link"
            label="About"
            position="left"
            target="_blank"
            disabled={true}
          />
        </div>
      </div>
    </div>
  )
}
