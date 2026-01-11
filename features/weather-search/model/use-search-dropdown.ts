import { useState, useEffect, useRef } from "react";

/**
 * 검색 드롭다운 UI 상태 관리
 * - 열기/닫기 상태
 * - 외부 클릭 감지
 */
export function useSearchDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeDropdown = () => setIsOpen(false);
  const openDropdown = () => setIsOpen(true);

  return {
    isOpen,
    setIsOpen,
    closeDropdown,
    openDropdown,
    inputRef,
    dropdownRef,
  };
}
