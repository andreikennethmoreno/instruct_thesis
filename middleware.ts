import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Define protected paths (all under /admin in this case)
  const protectedPaths = ["/dashboard/admin"];

  const { pathname } = req.nextUrl;

  // Check if the request is for a protected path
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    // If no token or role is not Admin, redirect to login
    if (!token || token.role !== "Admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Define which routes the middleware applies to
export const config = {
  matcher: ["/dashboard/admin/:path*"],
};
