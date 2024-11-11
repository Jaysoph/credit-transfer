import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")
  const { pathname } = request.nextUrl

  if (accessToken && pathname === "/") {
    return NextResponse.redirect(new URL("/transfer", request.url))
  }

  if (!accessToken) {
    const restrictedPaths = [
      "/vocationalmanage",
      "/manageaccount",
      "/universitymanage",
      "/department"
    ]

    if (restrictedPaths.includes(pathname)) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next).*)"]
}
