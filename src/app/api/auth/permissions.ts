/**
 * Permission Structure Overview:
 * Permissions are defined using a three-part syntax: [RESOURCE]:[ACTION]:[SCOPE].
 * This structure provides a granular and consistent way to manage access control across the application.
 *
 * Components:
 * - RESOURCE: The entity being acted upon (e.g., 'USER', 'RATING', 'ORGANIZATION').
 * - ACTION: The operation allowed (e.g., 'READ', 'CREATE', 'UPDATE', 'DELETE', or '*' for all actions).
 * - SCOPE: The extent of access:
 *   - 'OWN': Applies to the user's own data (e.g., their own profile or ratings).
 *   - 'ASSIGNED': Applies to data of entities assigned to the user (e.g., employees under a supervisor, or organizations via OrganizationMember).
 *   - '*': Applies to all data of that resource type within the system.
 *
 * Purpose:
 * These permissions are used to enforce role-based access control (RBAC) for different user roles (OWNER, SUPERVISOR, EMPLOYEE).
 * They determine what actions a user can perform on which resources and within what boundaries, ensuring data privacy and security.
 * Example: 'USER:READ:ASSIGNED' allows a supervisor to read the profiles of employees they supervise, but not other users.
 */

export const OWNER_PERMISSIONS = [
  "ORGANIZATION:*:*", // Owners can do anything with all organizations
  "USER:*:*", // Owners can do anything with all users
  "RATING:*:*", // Owners can do anything with all ratings
];

export const SUPERVISOR_PERMISSIONS = [
  "USER:READ:OWN", // Supervisors can read their own user data
  "USER:READ:ASSIGNED", // Supervisors can read data of employees they supervise
  "RATING:READ:OWN", // Supervisors can read their own ratings (as employee or supervisor)
  "RATING:READ:ASSIGNED", // Supervisors can read ratings of their assigned employees
  "RATING:CREATE:ASSIGNED", // Supervisors can create ratings for their assigned employees
  "RATING:UPDATE:ASSIGNED", // Supervisors can update ratings for their assigned employees
  "RATING:DELETE:ASSIGNED", // Supervisors can delete ratings for their assigned employees
  "ORGANIZATION:READ:ASSIGNED", // Supervisors can read all data about organizations they are assigned to
];

export const EMPLOYEE_PERMISSIONS = [
  "USER:READ:OWN", // Employees can read their own user data
  "USER:UPDATE:OWN", // Employees can update their own user data
  "USER:DELETE:OWN", // Employees can delete their own user data (e.g., account deletion)
  "RATING:READ:OWN", // Employees can read their own ratings
  "ORGANIZATION:READ:ASSIGNED", // Employees can read all data about organizations they are assigned to
];
