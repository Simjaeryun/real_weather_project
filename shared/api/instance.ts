import ky, { type HTTPError } from "ky";
import { createApiLogger } from "./logger";
import { ENV } from "../constants/env";

interface RequestWithTimestamp extends Request {
  __startTime?: number;
}

/**
 * 공통 Hooks 정의
 */
const commonHooks = {
  beforeRequest: [
    async (request: Request) => {
      const startTime = Date.now();
      (request as RequestWithTimestamp).__startTime = startTime;
      return request;
    },
  ],
  afterResponse: [
    async (request: Request, _options: unknown, response: Response) => {
      const duration =
        Date.now() - ((request as RequestWithTimestamp).__startTime || 0);

      createApiLogger({
        type: "CLIENT",
        method: request.method,
        url: request.url,
        status: response.status,
        duration,
      });

      return response;
    },
  ],
  beforeError: [
    async (error: HTTPError) => {
      const duration =
        Date.now() -
        ((error.request as RequestWithTimestamp)?.__startTime || 0);
      const status = error.response?.status;

      createApiLogger({
        type: "CLIENT",
        method: error.request.method,
        url: error.request.url,
        status,
        duration,
        error,
      });

      return error;
    },
  ],
};

/**
 * 내부 API용 인스턴스 (Next.js API Routes)
 * prefixUrl을 사용하여 상대 경로 지원
 */
export const internalApi = ky.create({
  timeout: 10000,
  prefixUrl: ENV.APP_URL || "",
  hooks: commonHooks,
});

/**
 * 외부 API용 인스턴스 (Open-Meteo 등)
 * prefixUrl 없이 절대 URL 사용
 */
export const externalApi = ky.create({
  timeout: 10000,
  hooks: commonHooks,
});

/**
 * @deprecated 호환성을 위해 남겨둠. internalApi 또는 externalApi 사용 권장
 */
export const apiInstance = externalApi;
