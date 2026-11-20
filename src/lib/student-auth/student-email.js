const internalDomain = "students.prograin.invalid";

export function internalStudentEmail(id) {
  return `${id}@${internalDomain}`;
}

export function visibleStudentEmail(email) {
  return email?.toLowerCase().endsWith(`@${internalDomain}`) ? "" : email;
}
