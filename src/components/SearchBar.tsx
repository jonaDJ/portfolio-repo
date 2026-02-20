import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  inputId?: string;
  label?: string;
  accent?: "blue" | "orange" | "emerald";
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search projects...",
  inputId = "projectSearch",
  label = "Search projects...",
  accent = "blue",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const accentStyles = {
    blue: "focus:ring-blue-500/60 focus:border-blue-400/70",
    orange: "focus:ring-orange-500/60 focus:border-orange-400/70",
    emerald: "focus:ring-emerald-500/60 focus:border-emerald-400/70",
  };

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchQuery, onSearch]);

  const handleClear = () => {
    setSearchQuery("");
    onSearch("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative flex w-full">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <input
        type="search"
        ref={inputRef}
        id={inputId}
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={`no-search-cancel w-full rounded-xl border border-gray-700 bg-gray-900/80 p-3 pl-10 pr-10 text-white placeholder-gray-500 transition focus:outline-none focus:ring-2 ${accentStyles[accent]}`}
      />
      <Search
        size={20}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
        aria-hidden="true"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search input"
          className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded p-1 text-gray-400 transition hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/60"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
