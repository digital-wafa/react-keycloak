export const TOKEN_KEY = "token";
export const REFRESH_TOKEN_KEY = "refresh_token";

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setToken(token?: string, refresh?: string): void {
  token && sessionStorage.setItem(TOKEN_KEY, token);
  refresh && sessionStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}
