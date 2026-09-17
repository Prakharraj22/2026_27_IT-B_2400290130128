// Central place that will later hold the real HTTP client (fetch/axios) config,
// base URL, auth headers, and interceptors once a backend exists.
// Every service function below is written as if it were already async/network-bound,
// so swapping the body for a real `fetch(`${BASE_URL}/v1/...`)` call is a drop-in change.

export const BASE_URL = '/v1';

export function simulateLatency<T>(data: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}
