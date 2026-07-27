import type { Access, FieldAccess, Where } from "payload";

import {
  canAccessEditorial,
  canAccessNewsletter,
  canAccessSources,
  canManageUsers,
  canPublishArticles,
  type RoleBearingUser,
  userHasRole,
} from "@/lib/roles";

export const anyone: Access = () => true;

export const authenticated: Access = ({ req }) => Boolean(req.user);

const roleUser = (user: unknown): RoleBearingUser => user as RoleBearingUser;

export const ownersOnly: Access = ({ req }) =>
  canManageUsers(roleUser(req.user));

export const editorialUsers: Access = ({ req }) =>
  canAccessEditorial(roleUser(req.user));

export const editorialOrSourceManagers: Access = ({ req }) =>
  canAccessEditorial(roleUser(req.user)) ||
  canAccessSources(roleUser(req.user));

export const sourceManagersOnly: Access = ({ req }) =>
  canAccessSources(roleUser(req.user));

export const newsletterUsers: Access = ({ req }) =>
  canAccessNewsletter(roleUser(req.user));

export const publishCapableEditors: Access = ({ req }) =>
  canPublishArticles(roleUser(req.user));

export const sourceFieldAccess: FieldAccess = ({ req }) =>
  canAccessSources(roleUser(req.user));

export const ownersFieldAccess: FieldAccess = ({ req }) =>
  userHasRole(roleUser(req.user), ["owner"]);

export const newsletterFieldAccess: FieldAccess = ({ req }) =>
  canAccessNewsletter(roleUser(req.user));

export const publicOrEditorial: Access = ({ req }) => {
  if (req.user) {
    return true;
  }

  return { _status: { equals: "published" } };
};

export function publishedArticleWhere(extra?: Where): Where {
  const publicWhere: Where = {
    and: [
      { _status: { equals: "published" } },
      { publicationDate: { less_than_equal: new Date().toISOString() } },
    ],
  };

  if (!extra) {
    return publicWhere;
  }

  return {
    and: [publicWhere, extra],
  };
}

export const publicPublishedArticles: Access = ({ req }) => {
  if (req.user) {
    return true;
  }

  return publishedArticleWhere();
};

export const publicPublishedPages: Access = ({ req }) => {
  if (req.user) {
    return true;
  }

  return { _status: { equals: "published" } };
};
