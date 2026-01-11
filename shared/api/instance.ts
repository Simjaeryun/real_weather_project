import ky from "ky";
import { createApiLogger } from "./logger";
import { ENV } from "../constants/env";

export const apiInstance = ky.create({
  timeout: 10000,
  prefixUrl: ENV.APP_URL || "",
  hooks: {
    beforeRequest: [
      async (request) => {
        const startTime = Date.now();
        (request as any).__startTime = startTime;

        return request;
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        const duration = Date.now() - ((request as any).__startTime || 0);

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
      async (error) => {
        const duration =
          Date.now() - ((error.request as any)?.__startTime || 0);
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
  },
});
