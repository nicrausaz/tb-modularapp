import { ArrowDownIcon, NewScreenIcon, OpenNewTabIcon, SaveIcon, TrashIcon } from '@/assets/icons'
import { Screen } from '@/models/Screen'
import { useState } from 'react'
import { Link } from 'react-router-dom'

type ScreenToolbarProps = {
  currentScreen: Screen
  screens: Screen[]
  onScreenSelection: (screen: Screen) => void
  onScreenAdd: (screenName: string) => void
}

export default function ScreenToolbar({ currentScreen, screens, onScreenSelection, onScreenAdd }: ScreenToolbarProps) {
  const [screenName, setScreenName] = useState('')

  const otherScreens = screens.filter((screen) => screen !== currentScreen)

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScreenName(e.target.value)
  }

  const handleAddScreen = () => {
    onScreenAdd(`Screen ${screens.length + 1}`)
  }

  return (
    <div className="border w-full rounded-lg shadow flex justify-between items-center bg-base-200 p-2 mb-4">
      <div>
        <input
          type="text"
          className="w-full px-4 py-2 rounded-lg input-md"
          placeholder="Screen name..."
          onChange={handleNameChange}
          defaultValue={currentScreen?.name}
        />
      </div>
      <div>
        <div className="dropdown dropdown-hover dropdown-end mr-2">
          <label tabIndex={0} className="btn m-1">
            {currentScreen?.name}
            <ArrowDownIcon className="w-4 h-4" />
          </label>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            {otherScreens.map((screen) => (
              <li key={screen.id}>
                <a onClick={() => onScreenSelection(screen)}>{screen.name}</a>
              </li>
            ))}
            <li className="border-t mt-2 pt-2">
              <a onClick={handleAddScreen}>
                <NewScreenIcon className="w-4 h-4" />
                Add new screen
              </a>
            </li>
          </ul>
        </div>
        <button className="btn btn-error mr-2">
          Delete
          <TrashIcon className="w-4 h-4" />
        </button>
        <button className="btn btn-success mr-2">
          save
          <SaveIcon />
        </button>
        <Link className="btn btn-info" to={`/visualize/${currentScreen?.id}`} target="_blank">
          Preview
          <OpenNewTabIcon className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
