// Where to send a user after successful authentication.
export function getHomePath(user) {
  if (user?.platformRole === "SUPER_ADMIN") {
    return "/superadmin/dashboard";
  }

  const memberships = user?.memberships || [];

  const activeRoles = memberships
    .filter((membership) => membership.status === "ACTIVE")
    .map((membership) => membership.role);

  if (activeRoles.includes("INSTITUTE_ADMIN")) {
    return "/institute/dashboard";
  }

  if (activeRoles.includes("TRAINER")) {
    return "/trainer/dashboard";
  }

  return "/student/dashboard";
}