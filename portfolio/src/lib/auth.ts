import { cookies } from "next/headers";

export const ADMIN_COOKIE = "mih_admin_session";

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "";
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const password = getAdminPassword();
  if (!password) return false;

  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === password;
}

export function isValidAdminPassword(input: string): boolean {
  const password = getAdminPassword();
  return Boolean(password) && input === password;
}

export function verifyAdminRequest(request: Request): boolean {
  const password = getAdminPassword();
  if (!password) return false;

  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${password}`) {
    return true;
  }

  return false;
}
