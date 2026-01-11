import { useState } from "react";
import { useFavorites } from "@/entities/favorite";

interface UseFavoriteCardActionsParams {
  favoriteId: string;
  initialAlias: string;
}

/**
 * FavoriteCard의 이벤트 핸들러 로직
 * - 별칭 편집
 * - 삭제
 */
export function useFavoriteCardActions({
  favoriteId,
  initialAlias,
}: UseFavoriteCardActionsParams) {
  const { removeFavorite, updateAlias } = useFavorites();

  // UI 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editedAlias, setEditedAlias] = useState(initialAlias);

  // 별칭 저장
  const handleSaveAlias = () => {
    if (editedAlias.trim()) {
      updateAlias(favoriteId, editedAlias.trim());
      setIsEditing(false);
    }
  };

  // 편집 취소
  const handleCancelEdit = () => {
    setEditedAlias(initialAlias);
    setIsEditing(false);
  };

  // 즐겨찾기 삭제
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`"${initialAlias}"를 즐겨찾기에서 제거하시겠습니까?`)) {
      removeFavorite(favoriteId);
    }
  };

  // 편집 모드 진입
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  return {
    // State
    isEditing,
    editedAlias,
    setEditedAlias,
    // Handlers
    handleSaveAlias,
    handleCancelEdit,
    handleRemove,
    handleEditClick,
  };
}
