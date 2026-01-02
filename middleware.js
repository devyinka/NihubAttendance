import { NextResponse } from "next/server";

export function middleware(req) {
  // req.cookies.get may return a Cookie object in some Next versions
  const tokenCookie = req.cookies.get("token");
  const token = tokenCookie?.value || tokenCookie || null;

  const protectedRoutes = [
    "/AddEvent",
    "/ManageEvent",
    "/subadmin",
    "/verify-email",
    "/Attendance",
    "/Scanner",
  ];

  const pathname = req.nextUrl.pathname;

  // Debug log to help verify middleware is running (remove for production)
  console.log("[middleware] pathname=", pathname, "hasToken=", !!token);

  // If user is trying to access a protected route
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/AdminLogin", req.url));
    }
  }

  return NextResponse.next();
}

// Scope middleware to only the protected routes to avoid accidental matches
export const config = {
  matcher: [
    "/AddEvent",
    "/ManageEvent",
    "/subadmin",
    "/verify-email",
    "/Attendance",
    "/Scanner",
  ],
};
