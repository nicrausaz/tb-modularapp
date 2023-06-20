import LoadingTopBar from '@/components/LoadingTopBar'
import ThemePicker from '@/components/ThemePicker'
import UsersList from '@/components/users/UsersList'
import { useFetchAuth } from '@/hooks/useFetch'
import { User } from '@/models/User'

export default function Settings() {
  const { data: users, loading, error } = useFetchAuth<User[]>('/api/users')

  if (loading) {
    return <LoadingTopBar />
  }

  if (error) {
    throw error
  }

  if (!users) {
    return <div>No users</div>
  }

  return (
    <div className="flex flex-col w-full items-center pb-20">
      <div className="bg-base-100 shadow rounded-box w-full md:w-3/4 p-4">
        <div className="hero">
          <div className="hero-content flex-col lg:flex-row-reverse justify-between">
            <img
              className="mask mask-squircle w-40 lg:w-60 shadow-2xl"
              src="https://daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.jpg"
            />
            <div>
              <h1 className="text-5xl font-bold">Modular app</h1>
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

        <UsersList users={users} />
      </div>
    </div>
  )
}
