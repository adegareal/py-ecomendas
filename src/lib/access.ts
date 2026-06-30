import type { AppSession, AppUser } from "../types/app";

const BOOTSTRAP_COMPANY_SLUG = "principal";
const BOOTSTRAP_USERNAME = "superadmin";

export function isBootstrapSuperAdmin(
  companySlug: string,
  username: string
) {
  return companySlug === BOOTSTRAP_COMPANY_SLUG && username === BOOTSTRAP_USERNAME;
}

export function normalizeSessionUser(user: AppUser, companySlug: string): AppUser {
  if (user.nivel === "super_admin" || isBootstrapSuperAdmin(companySlug, user.username)) {
    return {
      ...user,
      nivel: "super_admin",
      role: "super_admin",
    };
  }

  return user;
}

export function normalizeSession(session: AppSession | null) {
  if (!session) {
    return null;
  }

  return {
    ...session,
    usuario: normalizeSessionUser(session.usuario, session.empresa.slug),
  };
}

export function isSuperAdminSession(session: AppSession | null) {
  if (!session) {
    return false;
  }

  return normalizeSessionUser(session.usuario, session.empresa.slug).nivel === "super_admin";
}