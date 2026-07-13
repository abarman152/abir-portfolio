const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

async function fetcher<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (
    res.status === 401 &&
    typeof window !== 'undefined' &&
    !path.startsWith('/auth') &&
    window.location.pathname.startsWith('/admin') &&
    window.location.pathname !== '/admin/login'
  ) {
    localStorage.removeItem('admin_token');
    window.location.replace('/admin/login');
  }
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  get: <T>(path: string, headers?: HeadersInit) => fetcher<T>(path, { headers }),
  post: <T>(path: string, body: unknown, headers?: HeadersInit) =>
    fetcher<T>(path, { method: 'POST', body: JSON.stringify(body), headers }),
  put: <T>(path: string, body: unknown, headers?: HeadersInit) =>
    fetcher<T>(path, { method: 'PUT', body: JSON.stringify(body), headers }),
  patch: <T>(path: string, body?: unknown, headers?: HeadersInit) =>
    fetcher<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined, headers }),
  delete: <T>(path: string, headers?: HeadersInit) => fetcher<T>(path, { method: 'DELETE', headers }),
};

export function authHeader(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}
