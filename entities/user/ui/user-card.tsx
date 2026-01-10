import { Card } from "@/shared/ui";
import type { User } from "../model/types";

interface UserCardProps {
  user: User;
  onClick?: () => void;
}

export function UserCard({ user, onClick }: UserCardProps) {
  return (
    <Card className="p-6 cursor-pointer" onClick={onClick}>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
        <div className="text-gray-600 space-y-1">
          <p className="flex items-center gap-2">
            <span className="font-medium">📧</span>
            <span className="break-all">{user.email}</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="font-medium">📞</span>
            <span>{user.phone}</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="font-medium">🏢</span>
            <span>{user.company.name}</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="font-medium">🌐</span>
            <span className="text-blue-600">{user.website}</span>
          </p>
        </div>
      </div>
    </Card>
  );
}
