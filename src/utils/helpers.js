const currentUserRole = (roles, role) => {
  if (Array.isArray(roles) && roles.length) {
    return roles.includes(role);
  }
  return false;
};

export const isUserAdmin = (roles) => currentUserRole(roles, "admin");
export const isUserInvestor = (roles) => currentUserRole(roles, "investor");
export const isUserAgent = (roles) => currentUserRole(roles, "agent");
export const isUserMSP = (roles) => currentUserRole(roles, "msp");
export const isUserOperator = (roles) => currentUserRole(roles, "operator");
export const isUserStudent = (roles) => currentUserRole(roles, "student");
export const isUserHire = (roles) => currentUserRole(roles, "hire");
export const isUserRoleUser = (roles) => currentUserRole(roles, "user");
