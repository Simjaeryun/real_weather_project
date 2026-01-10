"use client";

import { useState } from "react";
import { useUsers, UserCard } from "@/entities/user";
import { Spinner } from "@/shared/ui";
import { UserDetailModal } from "./user-detail-modal";

export function UserList() {
  const { data: users, isLoading, error } = useUsers();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        <p className="text-xl font-semibold">오류가 발생했습니다</p>
        <p className="mt-2">{error.message}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users?.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onClick={() => setSelectedUserId(user.id)}
          />
        ))}
      </div>

      {selectedUserId && (
        <UserDetailModal
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </>
  );
}
