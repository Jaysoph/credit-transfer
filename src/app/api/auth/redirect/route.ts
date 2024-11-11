// app/api/auth/redirect/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value
  const pathname = request.nextUrl.searchParams.get("pathname") || "/"

  // Redirect to /transfer if accessToken is present and pathname is "/"
  if (accessToken && pathname === "/") {
    return NextResponse.redirect(new URL("/transfer", request.url))
  }

  // If accessToken is not present, restrict access to certain pages
  if (!accessToken) {
    const restrictedPaths = [
      "/vocationalmanage",
      "/manageaccount",
      "/universitymanage",
      "/department"
    ]

    // Redirect to "/" for restricted paths without an accessToken
    if (restrictedPaths.includes(pathname)) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // If no redirection is needed, return a successful response
  return NextResponse.json({ message: "No redirection needed" })
}
