type SearchBarProps = {
  hasFilters?: boolean
  query: string
  filters: string[]
  currentFilter: string
  onQueryChange?: (search: string) => void
  onFilterChange?: (filter: string) => void
}

export default function SearchBar({ hasFilters, query, filters, currentFilter, onQueryChange, onFilterChange }: SearchBarProps) {
  
  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onQueryChange) {
      onQueryChange(event.target.value)
    }
  }

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (onFilterChange) {
      onFilterChange(event.target.value)
    }
  }
  
  
  return (
    <div className="join w-full shadow">
      <div className="flex-grow">
        <div>
          <input className="input input-bordered join-item w-full" placeholder="Search..." defaultValue={query} onChange={handleQueryChange} />
        </div>
      </div>
      {hasFilters && (
        <select className="select select-bordered join-item flex-grow-0" defaultValue={currentFilter} onChange={handleFilterChange}>
          {filters.map((filter) => (
            <option value={filter} key={filter}>{filter}</option>
          ))}
        </select>
      )}
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
