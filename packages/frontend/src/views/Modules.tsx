import ModuleCard from '@/components/module/ModuleCard'
import { useFetchAuth } from '@/hooks/useFetch'
import { Module } from '@/models/Module'

export default function Modules() {
  const { data, error, loading } = useFetchAuth<Module[]>('/api/modules')

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  console.log(data)

  return (
    <div className="flex flex-col h-full pb-20 container mx-auto">
      <h1 className="text-2xl font-bold">Modules</h1>

      <div className="w-full my-4">
        <div className="input-group">
          <input type="text" placeholder="Search…" className="input input-bordered shadow w-full" />
          <button className="btn btn-square">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-3 gap-8 items-center">
        {data &&
          data.map((module, i) => (
            <ModuleCard
              key={i}
              id={module.id}
              title={module.name}
              description={module.description}
              active={module.enabled}
            />
          ))}
      </div>
    </div>
  )
}
