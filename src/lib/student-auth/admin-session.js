import { notFound } from "next/navigation";
import { requireStudentSession } from "./session";
import { isStudentAdmin } from "../student-progress";

export async function requireAcademyAdmin() {
  const session = await requireStudentSession();
  if (!isStudentAdmin(session.user)) notFound();
  return session;
}
