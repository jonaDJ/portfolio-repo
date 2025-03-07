import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

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

  return (
    <div className="relative p-2 w-full flex">
      <label htmlFor="projectSearch" className="sr-only">
        Search projects...
      </label>
      <input
        type="search"
        id="projectSearch"
        placeholder="Search projects..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-3 pl-10 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Search
        size={20}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
        aria-hidden="true"
      />
    </div>
  );
};

export default SearchBar;
