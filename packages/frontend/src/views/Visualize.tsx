export default function Visualize() {
  return (
    <div className="flex flex-col h-screen pb-20 bg-base-200">
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center justify-center rounded bg-gray-50 h-28">
            <p className="text-2xl text-gray-400">+</p>
          </div>
          <div className="flex items-center justify-center rounded bg-gray-50 h-28">
            <p className="text-2xl text-gray-400">+</p>
          </div>
          <div className="flex items-center justify-center rounded bg-gray-50 h-28">
            <p className="text-2xl text-gray-400">+</p>
          </div>
          <div className="flex items-center justify-center rounded bg-gray-50 h-28">
            <p className="text-2xl text-gray-400">+</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-48 mb-4 rounded bg-gray-50">
          <p className="text-2xl text-gray-400 ">+</p>
        </div>
      </div>
    </div>
  )
}
