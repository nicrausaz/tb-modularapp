import { useLoaderData, useParams } from 'react-router-dom'


export default function Module() {
  // const {id } = useLoaderData<{ id: string }>()


  const { moduleId } = useParams()

  const testConfig = [
    {
      name: 'test',
      type: 'text',
      label: 'What is your name?',
      placeholder: 'Type here',
      value: 'test',
    },
  ]

  return (
    <div className="flex flex-col h-full overflow-scroll pb-20">
      {/* <h1 className="text-2xl font-bold">Module (id: {moduleId})</h1> */}

      <div className="bg-gray-100 rounded-box flex items-center p-4 mb-4 shadow-lg">
        <div className="flex-1 px-2">
          <div className="flex items-center gap-4">
            <img
              className="mask mask-squircle"
              src="https://daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.jpg"
              width={100}
              height={100}
            />
            <div>
              <h2 className="text-3xl font-extrabold">test</h2>
              <h3 className="mt-2">This is the description of the module</h3>
            </div>
          </div>
        </div>
        <div className="flex-0">
          <p>Version: 1.0.0</p>
          <p>Dev: nicrausaz</p>
        </div>
      </div>

      <div className="flex flex-col w-full items-center">
        <div className="divider text-2xl text-neutral font-bold mb-6">Actions</div>

        <div className="bg-base-100 shadow rounded-box w-full md:w-3/4 p-4">
          <div className="flex flex-col w-full lg:flex-row">
            <div className="gap-2">
              <button className="btn btn-primary">Start</button>
              <button className="btn btn-error">Save</button>
            </div>
          </div>
        </div>

        <div className="divider text-2xl text-neutral font-bold my-6">Configuration</div>

        {/* <h2 className="text-2xl font-bold">Configuration</h2> */}
        <div className="bg-base-100 shadow rounded-box w-full md:w-3/4 p-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">What is your name?</span>
            </label>
            <input type="text" placeholder="Type here" className="input input-bordered w-full" />
            <label className="label">
              <span className="label-text-alt text-gray-500">Bottom Left label</span>
            </label>

            <div className="divider m-0"></div>

            <label className="label">
              <span className="label-text">What is your name?</span>
            </label>
            <input type="text" placeholder="Type here" className="input input-bordered w-full" />
            <label className="label">
              <span className="label-text-alt text-gray-500">Bottom Left label</span>
            </label>

            <div>
              <button className="btn btn-primary">reset to default</button>
              <button className="btn btn-error">Save</button>
            </div>
          </div>
        </div>
        {/* <div className="divider"></div>
        <div className="rounded-box shadow w-1/2">
          <h2 className="text-2xl font-bold">Other informations</h2>
          <button className="btn"> Disable </button>
        </div> */}
      </div>
    </div>
  )
}
