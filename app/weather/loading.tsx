import { Spinner } from "@/shared/ui";

export default function WeatherLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            날씨 정보를 불러오는 중...
          </p>
        </div>
      </div>
    </div>
  );
}
