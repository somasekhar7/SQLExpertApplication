import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Create Axios instance
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:9005/api",
  withCredentials: true, // send cookies automatically
  headers: { "Content-Type": "application/json" },
});

/**
 * Internal queue type for managing multiple failed requests
 * during a single refresh cycle
 */
interface FailedRequest {
  resolve: (token?: string) => void;
  reject: (error: unknown) => void;
}

/**
 * Track refresh state
 */
let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

/**
 * Process all queued requests after refresh attempt
 */
const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach((req) => {
    if (error) req.reject(error);
    else req.resolve(token ?? "");
  });
  failedQueue = [];
};

/**
 * Interceptor: refresh expired access token automatically
 */
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError): Promise<AxiosResponse | never> => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only trigger refresh on 401 (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Another refresh in progress → queue this request
        return new Promise<AxiosResponse>((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(api(originalRequest)), // retry after refresh
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call backend refresh endpoint
        await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL || "http://localhost:9005/api"
          }/auth/refresh`,
          { withCredentials: true }
        );

        // ✅ Refresh succeeded — retry all queued requests
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        // ❌ Refresh failed — reject all queued requests
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For all other errors, reject normally
    return Promise.reject(error);
  }
);

export default api;
