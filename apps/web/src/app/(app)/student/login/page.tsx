import { redirect } from "next/navigation";

/**
 * Legacy route — /student/login
 * The canonical student login page is now /auth/student/login.
 * This redirect ensures any bookmarked or hard-coded links still work.
 */
export default function StudentLoginRedirect() {
  redirect("/auth/student/login");
}
