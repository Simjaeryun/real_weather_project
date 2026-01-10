import { UserList } from "@/features/user-list";

export default function Home() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          사용자 목록
        </h2>
        <p className="text-gray-600">
          카드를 클릭하면 상세 정보를 확인할 수 있습니다.
        </p>
      </div>
      <UserList />
    </div>
  );
}
