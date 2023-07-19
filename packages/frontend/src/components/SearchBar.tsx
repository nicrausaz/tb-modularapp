import { SearchIcon } from '@/assets/icons'
import { useTranslation } from 'react-i18next'

type SearchBarProps = {
  hasFilters?: boolean
  query: string
  filters: Array<{ key: string; label: string }>
  currentFilter: string
  onQueryChange?: (search: string) => void
  onFilterChange?: (filter: string) => void
}

export default function SearchBar({
  hasFilters,
  query,
  filters,
  currentFilter,
  onQueryChange,
  onFilterChange,
}: SearchBarProps) {
  const { t } = useTranslation()

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
          <input
            className="input input-bordered join-item w-full"
            placeholder={t('modules.search_placeholder')}
            defaultValue={query}
            onChange={handleQueryChange}
          />
        </div>
      </div>
      {hasFilters && (
        <select
          className="select select-bordered join-item flex-grow-0"
          defaultValue={currentFilter}
          onChange={handleFilterChange}
        >
          {filters.map((filter) => (
            <option value={filter.key} key={filter.key}>
              {filter.label}
            </option>
          ))}
        </select>
      )}
      <button type="button" className="btn join-item flex-grow-0 border border-gray-300">
        <SearchIcon />
      </button>
    </div>
  )
}
