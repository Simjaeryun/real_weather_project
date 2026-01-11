import { useState } from "react";

interface UseFavoriteCardParams {
  initialAlias: string;
  favoriteId: string;
  onUpdateAlias: (id: string, alias: string) => void;
  onRemove: (id: string) => void;
}

/**
 * FavoriteCard의 편집/삭제 로직을 관리하는 Hook
 */
export function useFavoriteCard({
  initialAlias,
  favoriteId,
  onUpdateAlias,
  onRemove,
}: UseFavoriteCardParams) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAlias, setEditedAlias] = useState(initialAlias);

  /**
   * 별칭 저장
   */
  const handleSaveAlias = () => {
    if (editedAlias.trim()) {
      onUpdateAlias(favoriteId, editedAlias.trim());
      setIsEditing(false);
    }
  };

  /**
   * 편집 취소
   */
  const handleCancelEdit = () => {
    setEditedAlias(initialAlias);
    setIsEditing(false);
  };

  /**
   * 즐겨찾기 삭제
   */
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`"${initialAlias}"를 즐겨찾기에서 제거하시겠습니까?`)) {
      onRemove(favoriteId);
    }
  };

  /**
   * 편집 모드 진입
   */
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  return {
    // State
    isEditing,
    editedAlias,
    setEditedAlias,
    setIsEditing,
    // Handlers
    handleSaveAlias,
    handleCancelEdit,
    handleRemove,
    handleEditClick,
  };
}
