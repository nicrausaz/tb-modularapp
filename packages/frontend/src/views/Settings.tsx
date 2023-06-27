import fetcher from '@/api/fetcher'
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

export default function Settings() {
  const { data, loading, error } = useFetchAuth<User[]>('/api/users')
  const { box, updateIcon } = useBox()

  const [users, setUsers] = useState<User[]>([])
  const { t } = useTranslation()
  const { tSuccess } = useToast()

  useEffect(() => {
    if (data) {
      setUsers(data)
    }
  }, [data])

  if (loading) {
    return <LoadingTopBar />
  }

  if (error) {
    throw error
  }

  if (!box || !users) {
    return null
  }

  const refreshUsers = async () => {
    const data = await fetcher<User[]>('/api/users')
    if (data) {
      setUsers(data)
    }
  }

  const uploadBoxIcon = async (file: File) => {
    updateIcon(file)
    tSuccess('Success', 'Icon changed successfully')
  }

  return (
    <div className="flex flex-col w-full items-center pb-20">
      <div className="hero bg-gradient-to-r from-primary to-accent p-10 ">
        <div className="hero-content flex-col lg:flex-row justify-between backdrop-blur-xl bg-white/30 shadow-xl rounded-xl">
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
                <div className="badge">v1.0.0</div>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full items-center">
        <div className="divider text-2xl text-neutral font-bold my-6">Your preferences</div>
        <div className="bg-base-100 shadow rounded-box w-full md:w-3/4 p-4">
          <label className="label">
            <span className="label-text">Theme</span>
          </label>
          <ThemePicker />

          <label className="label">
            <span className="label-text">Language</span>
          </label>
          <LanguagePicker />
        </div>
      </div>

      <div className="flex flex-col w-full items-center">
        <div className="divider text-2xl text-neutral font-bold my-6">Box configuration</div>
        <div className="bg-base-100 shadow rounded-box w-full md:w-3/4 p-4">
          <Input
            label="Box name"
            placeholder="My box"
            onChange={(value) => console.log(value)}
            name="boxname"
            value="Modular App"
          />

          <label className="label">
            <span className="label-text">Box image</span>
          </label>
          <FilePreviewerInput
            onUpload={uploadBoxIcon}
            currentPicture={`/api/box/static/${box.icon}`}
            placeholder="assets/logo.svg"
            rounded={false}
            className="h-20 w-20"
          />

          <div className="divider"></div>

          <UsersList users={users} onUpdated={refreshUsers} />
        </div>
      </div>

      <div className="flex flex-col w-full items-center">
        <div className="divider text-2xl text-neutral font-bold my-6">Others</div>
        <div className="bg-base-100 shadow rounded-box w-full md:w-3/4 p-4">
          <a className="link link-info" href="http://localhost:3000/api-docs" target="_blank">
            API Documentation
          </a>
          <a className="link link-info" href="http://localhost:3000/api-docs" target="_blank">
            API Documentation
          </a>
        </div>
      </div>
    </div>
  )
}
