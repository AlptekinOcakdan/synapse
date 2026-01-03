/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as academician from "../academician.js";
import type * as academics from "../academics.js";
import type * as academy from "../academy.js";
import type * as applications from "../applications.js";
import type * as auth from "../auth.js";
import type * as chats from "../chats.js";
import type * as departments from "../departments.js";
import type * as http from "../http.js";
import type * as mail from "../mail.js";
import type * as mails from "../mails.js";
import type * as projects from "../projects.js";
import type * as seed from "../seed.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  academician: typeof academician;
  academics: typeof academics;
  academy: typeof academy;
  applications: typeof applications;
  auth: typeof auth;
  chats: typeof chats;
  departments: typeof departments;
  http: typeof http;
  mail: typeof mail;
  mails: typeof mails;
  projects: typeof projects;
  seed: typeof seed;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
