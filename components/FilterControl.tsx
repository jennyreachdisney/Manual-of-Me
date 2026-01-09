import React from 'react';
import { Search, Filter } from 'lucide-react';
import { FilterType } from '../types';

interface FilterControlProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  filterType: FilterType;
  onFilterChange: (val: FilterType) => void;
}

const FilterControl: React.FC<FilterControlProps> = ({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      
      {/* Search Bar */}
      <div className="relative w-full sm:w-1/2">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="키워드 검색..."
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-lg w-full sm:w-auto">
        {(Object.keys(FilterType) as Array<keyof typeof FilterType>).map((type) => {
          const isActive = filterType === FilterType[type];
          let label = '';
          switch (FilterType[type]) {
            case FilterType.ALL: label = '전체'; break;
            case FilterType.CONFIRMED: label = '확정됨 (3+)'; break;
            case FilterType.UNCONFIRMED: label = '미확정'; break;
          }

          return (
            <button
              key={type}
              onClick={() => onFilterChange(FilterType[type])}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                isActive
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterControl;