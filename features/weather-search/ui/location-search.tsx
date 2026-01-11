"use client";

import type { Location } from "@/entities/location";
import { useFavoriteToggle } from "@/entities/favorite";
import { Spinner } from "@/shared/ui";
import {
  useLocationSearch,
  useSearchDropdown,
  useKeyboardNavigation,
} from "../model";

interface LocationSearchProps {
  onSelect: (location: Location) => void;
  placeholder?: string;
}

export function LocationSearch({
  onSelect,
  placeholder = "장소를 검색하세요 (예: 서울, 강남구)",
}: LocationSearchProps) {
  // 검색 로직
  const { query, setQuery, results, isLoading, clearSearch } =
    useLocationSearch();

  // 드롭다운 상태
  const { isOpen, setIsOpen, closeDropdown, inputRef, dropdownRef } =
    useSearchDropdown();

  // 즐겨찾기 토글 (entities/favorite에서)
  const { toggleFavorite, isFavorite } = useFavoriteToggle();

  // 선택 처리
  const handleSelect = (location: Location) => {
    onSelect(location);
    clearSearch();
    closeDropdown();
    inputRef.current?.blur();
  };

  // 키보드 네비게이션
  const { selectedIndex, handleKeyDown, resetSelection } =
    useKeyboardNavigation(results, isOpen, handleSelect, closeDropdown);

  // 검색 결과가 나오면 드롭다운 열기
  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (value.trim() && results.length > 0) {
      setIsOpen(true);
    }
    resetSelection();
  };

  const handleToggleFavorite = async (
    e: React.MouseEvent,
    location: Location,
  ) => {
    e.stopPropagation();
    await toggleFavorite(location);
  };

  const handleClearInput = () => {
    clearSearch();
    closeDropdown();
  };

  return (
    <div className="relative w-full">
      {/* 검색 입력 */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <svg
            className={`w-5 h-5 transition-colors ${query ? "text-blue-500" : "text-gray-400"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 text-base bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md focus:shadow-lg placeholder:text-gray-400"
        />

        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Spinner size="sm" />
          </div>
        )}

        {query && !isLoading && (
          <button
            onClick={handleClearInput}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* 검색 결과 드롭다운 */}
      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-3 bg-white border-2 border-gray-100 rounded-2xl shadow-2xl max-h-[500px] overflow-hidden animate-dropdown"
        >
          <div className="overflow-y-auto max-h-[500px] custom-scrollbar">
            {results.map((location, index) => (
              <div
                key={location.id}
                className={`group w-full px-5 py-4 transition-all border-b border-gray-50 last:border-b-0 ${
                  index === selectedIndex
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50"
                    : "hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                  <button
                    onClick={() => handleSelect(location)}
                    className="flex-1 min-w-0 text-left"
                  >
                    <div className="font-semibold text-gray-900 mb-0.5 group-hover:text-blue-600 transition-colors">
                      {location.displayName}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {location.fullAddress}
                    </div>
                  </button>
                  <button
                    onClick={(e) => handleToggleFavorite(e, location)}
                    className="flex-shrink-0 p-2 rounded-lg hover:bg-white/50 transition-all"
                    title={
                      isFavorite(location.id)
                        ? "즐겨찾기 제거"
                        : "즐겨찾기 추가"
                    }
                  >
                    {isFavorite(location.id) ? (
                      <svg
                        className="w-5 h-5 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-gray-400 hover:text-yellow-500 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => handleSelect(location)}
                    className="flex-shrink-0"
                  >
                    <svg
                      className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 검색 결과 없음 */}
      {isOpen && !isLoading && query.trim() && results.length === 0 && (
        <div className="absolute z-50 w-full mt-3 bg-white border-2 border-gray-100 rounded-2xl shadow-2xl p-8 text-center animate-dropdown">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-600 font-medium mb-1">
            &quot;{query}&quot; 검색 결과가 없습니다
          </p>
          <p className="text-sm text-gray-400">다른 검색어를 입력해보세요</p>
        </div>
      )}
    </div>
  );
}
