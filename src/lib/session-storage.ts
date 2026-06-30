import type { AppSession } from "../types/app";

const SESSION_KEY = "py-encomendas-session";

export function getStoredSession() {
  const raw = window.localStorage.getItem(SESSION_KEY);

  if (!raw) {
    return null;
  }

  return JSON.parse(raw) as AppSession;
}

export function setStoredSession(session: AppSession) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearStoredSession() {
  window.localStorage.removeItem(SESSION_KEY);
}