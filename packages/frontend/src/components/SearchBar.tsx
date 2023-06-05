type SearchBarProps = {
  query: string
  setQuery?: (search: string) => void
  typeFilters: string[]
  setTypeFilter?: (filter: string) => void
  currentTypeFilter: string
}

export default function SearchBar({ query, typeFilters, currentTypeFilter }: SearchBarProps) {
  return (
    <div className="join w-full shadow">
      <div className="flex-grow">
        <div>
          <input className="input input-bordered join-item w-full" placeholder="Search..." defaultValue={query} />
        </div>
      </div>
      <select className="select select-bordered join-item flex-grow-0" defaultValue={currentTypeFilter}>
        {typeFilters.map((filter) => (
          <option value={filter}>{filter}</option>
        ))}
      </select>
      <button className="btn join-item flex-grow-0 border border-gray-300">
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
  )
}
