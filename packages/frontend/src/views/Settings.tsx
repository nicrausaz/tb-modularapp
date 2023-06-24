import fetcher from '@/api/fetcher'
import LoadingTopBar from '@/components/LoadingTopBar'
import ThemePicker from '@/components/ThemePicker'
import UsersList from '@/components/users/UsersList'
import { useFetchAuth } from '@/hooks/useFetch'
import { User } from '@/models/User'
import { useEffect, useState } from 'react'

export default function Settings() {
  const { data, loading, error } = useFetchAuth<User[]>('/api/users')
  const [users, setUsers] = useState<User[]>([])

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

  if (!users) {
    return <div>No users</div>
  }

  const refreshUsers = async () => {
    const data = await fetcher<User[]>('/api/users')
    if (data) {
      setUsers(data)
    }
  }

  return (
    <div className="flex flex-col w-full items-center pb-20">
      <div className="hero bg-gradient-to-r from-primary to-accent p-10 ">
        <div className="hero-content flex-col lg:flex-row justify-between backdrop-blur-xl bg-white/30 shadow-xl rounded-xl">
          <img className="mask w-20 lg:w-36" src="/api/box/static/logo.svg" />
          <div>
            <h1 className="text-4xl font-bold">Modular app</h1>
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
        </div>
      </div>

      <div className="flex flex-col w-full items-center">
        <div className="divider text-2xl text-neutral font-bold my-6">Box configuration</div>
        <div className="bg-base-100 shadow rounded-box w-full md:w-3/4 p-4">
          <UsersList users={users} onUpdated={refreshUsers} />
        </div>
      </div>
    </div>
  )
}
