/**
 * SkillBridge — Central API Client
 *
 * Thin fetch wrapper that:
 *  - Reads the backend base URL from NEXT_PUBLIC_API_URL
 *  - Normalises JSON parsing, error handling, and timeouts
 *  - Exposes typed helpers (get/post/put/patch/del)
 *  - Exposes the canonical endpoint map so pages never hardcode paths
 *
 * No business logic, scoring, or ML calls are implemented here — this is
 * transport only. The backend remains the source of truth.
 */

export type ApiResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      error: string;
      code?: string;
      details?: Record<string, string[]>;
    };

/* -------------------------------------------------------------------------- */
/*                                Configuration                               */
/* -------------------------------------------------------------------------- */

const RAW_BASE_URL =
  (globalThis as typeof globalThis & {
    process?: {
      env?: Record<string, string | undefined>;
    };
  }).process?.env?.NEXT_PUBLIC_API_URL ?? "";

/** Base URL with trailing slashes removed. Empty string means "same origin". */
export const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, "");

export const DEFAULT_TIMEOUT_MS = 15_000;

export function isApiConfigured(): boolean {
  return API_BASE_URL.length > 0;
}

/* -------------------------------------------------------------------------- */
/*                                  Endpoints                                 */
/* -------------------------------------------------------------------------- */

export const ENDPOINTS = {
  health: "/health",
  auth: {
    me: "/auth/me",
  },
  profile: {
    me: "/profile/me",
    careerProfiling: "/profile/career-profiling",
  },
  assessments: {
    list: "/assessments",
    byId: (id: string) => `/assessments/${encodeURIComponent(id)}`,
  },
  skills: {
    passport: "/skills/passport",
    gapAnalysis: "/skills/gap-analysis",
  },
  roadmap: {
    me: "/roadmap/me",
  },
  evidence: {
    list: "/evidence",
  },
  opportunities: {
    list: "/opportunities",
    byId: (id: string) => `/opportunities/${encodeURIComponent(id)}`,
  },
} as const;

/* -------------------------------------------------------------------------- */
/*                                   Errors                                   */
/* -------------------------------------------------------------------------- */

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    options?: { code?: string; details?: Record<string, string[]> },
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = options?.code;
    this.details = options?.details;
  }

  get isNetworkError(): boolean {
    return this.status === 0;
  }

  get isTimeout(): boolean {
    return this.code === "TIMEOUT";
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }
}

/* -------------------------------------------------------------------------- */
/*                                Request Core                                */
/* -------------------------------------------------------------------------- */

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  /** Query parameters; undefined/null values are skipped */
  query?: Record<string, string | number | boolean | undefined | null>;
  /** Abort after this many ms (default: DEFAULT_TIMEOUT_MS) */
  timeoutMs?: number;
  /** Pass-through to fetch for Next.js caching semantics */
  cache?: RequestCache;
  /** Pass-through to fetch for Next.js revalidation */
  next?: { revalidate?: number | false; tags?: string[] };
  /** External abort signal (merged with the internal timeout signal) */
  signal?: AbortSignal;
}

function buildUrl(
  path: string,
  query?: RequestOptions["query"],
): string {
  const normalisedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${API_BASE_URL}${normalisedPath}`;

  if (!query) return url;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;
    params.append(key, String(value));
  }

  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

function mergeSignals(
  timeoutMs: number,
  external?: AbortSignal,
): { signal: AbortSignal; cleanup: () => void; timedOut: () => boolean } {
  const controller = new AbortController();
  let didTimeout = false;

  const timer = setTimeout(() => {
    didTimeout = true;
    controller.abort();
  }, timeoutMs);

  const onExternalAbort = () => controller.abort();
  if (external) {
    if (external.aborted) controller.abort();
    else external.addEventListener("abort", onExternalAbort, { once: true });
  }

  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timer);
      external?.removeEventListener("abort", onExternalAbort);
    },
    timedOut: () => didTimeout,
  };
}

async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  try {
    const text = await response.text();
    return text.length ? text : null;
  } catch {
    return null;
  }
}

function extractErrorMessage(body: unknown, fallback: string): string {
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    if (typeof record.error === "string") return record.error;
    if (typeof record.message === "string") return record.message;
    if (typeof record.detail === "string") return record.detail;
  }
  if (typeof body === "string" && body.trim().length) return body;
  return fallback;
}

function extractErrorCode(body: unknown): string | undefined {
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    if (typeof record.code === "string") return record.code;
  }
  return undefined;
}

function extractErrorDetails(
  body: unknown,
): Record<string, string[]> | undefined {
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    const details = record.details;
    if (details && typeof details === "object" && !Array.isArray(details)) {
      return details as Record<string, string[]>;
    }
  }
  return undefined;
}

/**
 * Core request function. Throws ApiError on any non-2xx, network, or
 * timeout failure. Prefer `safeRequest` in UI code where you want a
 * non-throwing result.
 */
export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    headers = {},
    query,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    cache,
    next,
    signal: externalSignal,
  } = options;

  const url = buildUrl(path, query);
  const { signal, cleanup, timedOut } = mergeSignals(timeoutMs, externalSignal);

  const hasBody = body !== undefined && body !== null && method !== "GET";

  const init: RequestInit & { next?: RequestOptions["next"] } = {
    method,
    headers: {
      Accept: "application/json",
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: hasBody ? JSON.stringify(body) : undefined,
    credentials: "include",
    signal,
    cache,
    next,
  };

  let response: Response;
  try {
    response = await fetch(url, init);
  } catch (err) {
    cleanup();
    if (timedOut()) {
      throw new ApiError(`Request timed out after ${timeoutMs}ms`, 0, {
        code: "TIMEOUT",
      });
    }
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError("Request was aborted", 0, { code: "ABORTED" });
    }
    const message =
      err instanceof Error ? err.message : "Network request failed";
    throw new ApiError(message, 0, { code: "NETWORK" });
  }

  cleanup();

  const parsed = await parseBody(response);

  if (!response.ok) {
    throw new ApiError(
      extractErrorMessage(
        parsed,
        `Request failed with status ${response.status}`,
      ),
      response.status,
      {
        code: extractErrorCode(parsed),
        details: extractErrorDetails(parsed),
      },
    );
  }

  // Unwrap `{ data: ... }` envelopes if the backend uses them; otherwise
  // return the raw payload.
  if (parsed && typeof parsed === "object" && "data" in (parsed as object)) {
    return (parsed as { data: T }).data;
  }

  return parsed as T;
}

/**
 * Non-throwing variant that returns a discriminated ApiResult.
 * Ideal for mapping directly onto UIState in components.
 */
export async function safeRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResult<T>> {
  try {
    const data = await request<T>(path, options);
    return { ok: true, data };
  } catch (err) {
    if (err instanceof ApiError) {
      return {
        ok: false,
        error: err.message,
        code: err.code,
        details: err.details,
      };
    }
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unexpected error",
      code: "UNKNOWN",
    };
  }
}

/* -------------------------------------------------------------------------- */
/*                               Verb Shortcuts                               */
/* -------------------------------------------------------------------------- */

type VerbOptions = Omit<RequestOptions, "method" | "body">;

export const api = {
  get: <T>(path: string, options?: VerbOptions) =>
    request<T>(path, { ...options, method: "GET" }),

  post: <T>(path: string, body?: unknown, options?: VerbOptions) =>
    request<T>(path, { ...options, method: "POST", body }),

  put: <T>(path: string, body?: unknown, options?: VerbOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),

  patch: <T>(path: string, body?: unknown, options?: VerbOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),

  del: <T>(path: string, options?: VerbOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),

  safe: {
    get: <T>(path: string, options?: VerbOptions) =>
      safeRequest<T>(path, { ...options, method: "GET" }),

    post: <T>(path: string, body?: unknown, options?: VerbOptions) =>
      safeRequest<T>(path, { ...options, method: "POST", body }),

    put: <T>(path: string, body?: unknown, options?: VerbOptions) =>
      safeRequest<T>(path, { ...options, method: "PUT", body }),

    patch: <T>(path: string, body?: unknown, options?: VerbOptions) =>
      safeRequest<T>(path, { ...options, method: "PATCH", body }),

    del: <T>(path: string, options?: VerbOptions) =>
      safeRequest<T>(path, { ...options, method: "DELETE" }),
  },
} as const;

export default api;