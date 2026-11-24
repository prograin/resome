export const studentAccountStatuses = ["active", "inactive", "banned"];
export const accountBannedCode = "ACCOUNT_BANNED";

export function studentAccountStatus(user) {
  if (user?.academyBanned) return "banned";
  return user?.academyActive === false ? "inactive" : "active";
}

export const isStudentBanned = (user) => studentAccountStatus(user) === "banned";
export const canRecordStudentScores = (user) => studentAccountStatus(user) === "active";
export const isAccountBannedError = (error) => error?.code === accountBannedCode;
