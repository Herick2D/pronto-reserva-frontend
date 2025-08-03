import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_PATHS = ["/login", "/register", "/api"]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next()
  }

  if (
    PUBLIC_PATHS.some(
      (path) =>
        pathname === path ||
        (path.endsWith("/") ? pathname.startsWith(path) : pathname.startsWith(path + "/"))
    )
  ) {
    return NextResponse.next()
  }

  const token = req.cookies.get("token")?.value
  if (!token) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = "/login"
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/|favicon\\.ico).*)"],
}
