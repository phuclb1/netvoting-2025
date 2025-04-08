import { env } from "@/env";
import ky, { KyInstance, Options } from "ky";
import { getServerSession } from "next-auth";
import { authLogic } from "./auth/authLogic";
import { TRPCError } from "@trpc/server";
import { getStatusKeyFromCode } from "@trpc/server/unstable-core-do-not-import";
import { curlOutput } from "./_logger";

export const baseUrl = env.BACKEND_API_URL + "/api/v1";

const options: Options = {
  prefixUrl: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  hooks: {
    beforeRequest: [
      async (request) => {
        const session = await getServerSession(authLogic);
        if (session?.access_token) {
          request.headers.set(
            "Authorization",
            `Bearer ${session.access_token}`
          );
        }
        const curlOut = await curlOutput(request.clone());
        console.log("[CURL]\n", curlOut);
      },
    ],
    afterResponse: [
      (_request, _options, response) => {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#client_error_responses
        if (400 <= response.status && response.status <= 511) {
          console.error("[API] Error", response.status);
          throw new TRPCError({ code: getStatusKeyFromCode(response.status) });
        }
      },
    ],
  },
};

const kyInstance = ky.create(options);

type ParamShape = Record<
  string,
  string | number | boolean | string[] | number[] | boolean[] | undefined | null
>;
type UrlKind = string | { url: string; params: ParamShape };
type FetchBodyKind<B = unknown> = B | BodyInit | null;

const api = (instance: KyInstance) => {
  const s = sanitizeUrl;
  return {
    get: <T>(url: UrlKind, config?: Options) =>
      instance.get<T>(s(url), config).json(),
    delete: <T>(url: UrlKind, config?: Options) =>
      instance.delete<T>(s(url), config).json(),
    post: <T, B = unknown>(
      url: string,
      body?: FetchBodyKind<B>,
      config?: Options
    ) => instance.post<T>(s(url), { ...config, json: body }).json(),
    postFormData: <T>(url: string, form?: FormData, config?: Options) =>
      instance.post<T>(s(url), { ...config, body: form }).json(),
    patch: <T, B = unknown>(
      url: string,
      body?: FetchBodyKind<B>,
      config?: Options
    ) => instance.patch<T>(s(url), { ...config, json: body }).json(),
    patchFormData: <T>(url: string, form?: FormData, config?: Options) =>
      instance.patch<T>(s(url), { ...config, body: form }).json(),
    put: <T, B = unknown>(
      url: string,
      body?: FetchBodyKind<B>,
      config?: Options
    ) => instance.put<T>(s(url), { ...config, json: body }).json(),
  };
};

function sanitizeUrl(stringOrObj: UrlKind): string {
  if (typeof stringOrObj === "object")
    return urlWithParams(removeSlash(stringOrObj.url), stringOrObj.params);
  return removeSlash(stringOrObj);
}

function removeSlash(url: string): string {
  const beginSlash = url.toString().startsWith("/");
  if (beginSlash) return url.toString().slice(1);
  return url;
}

function urlWithParams(url: string, params: ParamShape = {}): string {
  const ret = [];
  for (const d in params) {
    if (params[d] === undefined || params[d] === null) break;

    if (Array.isArray(params[d])) {
      params[d].forEach((f) => {
        ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(f));
      });
    } else {
      ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(params[d]));
    }
  }
  const paramsChunk = ret.join("&");

  if (!paramsChunk.length) return url;

  return `${url}?${paramsChunk}`;
}

const _ky = api(kyInstance);
export { _ky };
