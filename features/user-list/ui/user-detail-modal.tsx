"use client";

import { useUser } from "@/entities/user";
import { Button, Spinner } from "@/shared/ui";

interface UserDetailModalProps {
  userId: number;
  onClose: () => void;
}

export function UserDetailModal({ userId, onClose }: UserDetailModalProps) {
  const { data: user, isLoading } = useUser(userId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <Spinner />
        ) : user ? (
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <Button variant="outline" size="sm" onClick={onClose}>
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    연락처 정보
                  </h3>
                  <div className="space-y-2 text-gray-600">
                    <p>
                      <span className="font-medium">이메일:</span> {user.email}
                    </p>
                    <p>
                      <span className="font-medium">전화:</span> {user.phone}
                    </p>
                    <p>
                      <span className="font-medium">웹사이트:</span>{" "}
                      <a
                        href={`https://${user.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {user.website}
                      </a>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    회사 정보
                  </h3>
                  <div className="space-y-2 text-gray-600">
                    <p>
                      <span className="font-medium">회사명:</span>{" "}
                      {user.company.name}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">주소</h3>
                <div className="text-gray-600">
                  <p>
                    {user.address.street}, {user.address.city}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={onClose}>닫기</Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
