import { useState } from "react";
import type { Location } from "@/entities/location";

/**
 * 키보드 네비게이션 로직
 * - 화살표 키로 아이템 선택
 * - Enter로 선택 확정
 * - Escape로 닫기
 */
export function useKeyboardNavigation(
  results: Location[],
  isOpen: boolean,
  onSelect: (location: Location) => void,
  onClose: () => void,
) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          onSelect(results[selectedIndex]);
        }
        break;
      case "Escape":
        onClose();
        break;
    }
  };

  const resetSelection = () => setSelectedIndex(-1);

  return {
    selectedIndex,
    handleKeyDown,
    resetSelection,
  };
}
