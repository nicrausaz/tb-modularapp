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
    console.log('refresh', data)
    if (data) {
      setUsers(data)
    }
  }
  // todo: use same layout as module.tsx
  return (
    <div className="flex flex-col w-full items-center pb-20">
      <div className="bg-base-100 shadow rounded-box w-full md:w-3/4 p-4 ">
        <div className="hero bg-gradient-to-r from-primary to-accent">
          <div className="hero-content flex-col lg:flex-row-reverse justify-between">
            <img className="mask w-40 lg:w-50" src="/api/box/static/logo.svg" />
            <div>
              <h1 className="text-4xl font-bold">Modular app</h1>
              <div>
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" />
                <p className="font-bold">v1.0</p>
              </div>
            </div>
          </div>
        </div>
        <div className="divider text-2xl text-neutral font-bold my-6">Your preferences</div>
        <div>
          <h1>Settings</h1>
          <ThemePicker />
        </div>
        <div className="divider text-2xl text-neutral font-bold my-6">Box configuration</div>

        <UsersList users={users} onUpdated={refreshUsers} />
      </div>
    </div>
  )
}
