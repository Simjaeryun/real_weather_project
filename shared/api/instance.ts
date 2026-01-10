// ----------------------------------------------------------------------
//! 서버사이드 API 인스턴스

import ky from "ky";
import { createApiLogger } from "./logger";

export const serverAPI = ky.create({
  prefixUrl: "https://jsonplaceholder.typicode.com",
  headers: {
    requestType: "SSR",
    role: "user",
  },
  timeout: 10000,
  retry: {
    limit: 2,
    methods: ["get", "post", "patch", "put", "delete"],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
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
          type: "SERVER",
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

        createApiLogger({
          type: "SERVER",
          method: error.request.method,
          url: error.request.url,
          status: error.response?.status,
          duration,
          error,
        });

        return error;
      },
    ],
  },
});

// ----------------------------------------------------------------------
//! 클라이언트 API 인스턴스

export const clientAPI = ky.create({
  prefixUrl: "https://jsonplaceholder.typicode.com",
  timeout: 10000,
  credentials: "include", // 쿠키 자동 포함
  headers: {
    role: "user",
    requestType: "CSR",
  },
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
