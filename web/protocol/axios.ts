import { env } from "@/env";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authLogic } from "./auth/authLogic";
import {
  AxiosError,
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  Canceler,
  Cancel,
} from "axios";
import { TRPCError } from "@trpc/server";

type AxiosMethods = Pick<
  AxiosInstance,
  "get" | "put" | "patch" | "post" | "delete"
>;
type WithAbortFn = AxiosMethods[keyof AxiosMethods];

type ApiExecutor<T> = {
  (url: string, body: unknown, config: ApiRequestConfig): AxiosPromise<T>;
  (url: string, config: ApiRequestConfig): AxiosPromise<T>;
};
type ApiExecutorArgs =
  | [string, unknown, ApiRequestConfig]
  | [string, ApiRequestConfig];

type ApiRequestConfig = AxiosRequestConfig & {
  abort?: (cancel: Canceler) => void;
};

type ApiError = AxiosError;

export const baseUrl = env.BACKEND_API_URL + "/api/v1";

const axiosParams = {
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
};

const axiosInstance = axios.create(axiosParams);

axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getServerSession(authLogic);
    if (session?.access_token) {
      config.headers["Authorization"] = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // TODO: logout
    }
    return Promise.reject(error);
  },
);

export const didAbort = (
  error: unknown,
): error is Cancel & { aborted: boolean } => axios.isCancel(error);

const getCancelSource = () => axios.CancelToken.source();

export const isApiError = (error: unknown): error is ApiError =>
  axios.isAxiosError(error);

const withAbort = <T>(fn: WithAbortFn) => {
  const executor: ApiExecutor<T> = async (...args: ApiExecutorArgs) => {
    const originalConfig = args[args.length - 1] as ApiRequestConfig;
    const { abort, ...config } = originalConfig;

    if (typeof abort === "function") {
      const { cancel, token } = getCancelSource();
      config.cancelToken = token;
      abort(cancel);
    }

    try {
      if (args.length > 2) {
        const [url, body] = args;
        return await fn<T>(url, body, config);
      } else {
        const [url] = args;
        return await fn<T>(url, config);
      }
    } catch (error) {
      // console.log("api error", error);
      if (didAbort(error)) {
        error.aborted = true;
      }

      // throw error;
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "AXIOS ERROR",
        cause: error,
      });
    }
  };

  return executor;
};

const withLogger = async <T>(promise: AxiosPromise<T>) =>
  promise.catch((error: Error) => {
    console.error(error);
    throw error;
  });

const api = (axios: AxiosInstance) => ({
  get: <T>(url: string, config: ApiRequestConfig = {}) =>
    withLogger<T>(withAbort<T>(axios.get)(url, config)),
  delete: <T>(url: string, config: ApiRequestConfig = {}) =>
    withLogger<T>(withAbort<T>(axios.delete)(url, config)),
  post: <T>(url: string, body: unknown = null, config: ApiRequestConfig = {}) =>
    withLogger<T>(withAbort<T>(axios.post)(url, body, config)),
  patch: <T>(url: string, body: unknown, config: ApiRequestConfig = {}) =>
    withLogger<T>(withAbort<T>(axios.patch)(url, body, config)),
  put: <T>(url: string, body: unknown, config: ApiRequestConfig = {}) =>
    withLogger<T>(withAbort<T>(axios.put)(url, body, config)),
});

const _axios = api(axiosInstance);

export { _axios };
