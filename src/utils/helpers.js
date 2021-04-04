const currentUserRole = (roles, role) => {
  // here we passing in an array of roles  and check that the length of the array is not zero
  if (Array.isArray(roles) && roles.length) {
    // check that the specified role is inside the array of roles: if it is, we return true
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
