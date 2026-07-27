export const userRoles = [
  "owner",
  "editor",
  "reviewer",
  "source_manager",
  "newsletter_editor",
] as const;

export type UserRole = (typeof userRoles)[number];

export type RoleBearingUser =
  | {
      active?: boolean | null;
      role?: UserRole | null;
      roles?: UserRole[] | null;
    }
  | null
  | undefined;

export const roleOptions = userRoles.map((role) => ({
  label: role
    .split("_")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" "),
  value: role,
}));

export function getUserRoles(user: RoleBearingUser): UserRole[] {
  if (!user || user.active === false) {
    return [];
  }

  if (Array.isArray(user.roles) && user.roles.length > 0) {
    return user.roles;
  }

  return user.role ? [user.role] : [];
}

export function userHasRole(user: RoleBearingUser, roles: UserRole[]): boolean {
  const resolved = getUserRoles(user);

  return (
    resolved.includes("owner") || roles.some((role) => resolved.includes(role))
  );
}

export function canAccessEditorial(user: RoleBearingUser): boolean {
  return userHasRole(user, ["editor", "reviewer"]);
}

export function canAccessSources(user: RoleBearingUser): boolean {
  return userHasRole(user, ["source_manager"]);
}

export function canAccessNewsletter(user: RoleBearingUser): boolean {
  return userHasRole(user, ["newsletter_editor", "editor"]);
}

export function canPublishArticles(user: RoleBearingUser): boolean {
  return userHasRole(user, ["editor"]);
}

export function canManageUsers(user: RoleBearingUser): boolean {
  return userHasRole(user, ["owner"]);
}
