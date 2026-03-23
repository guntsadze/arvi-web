import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SEO_ROUTES, isPublicRoute } from "@/constants/routes";

export default function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  if (SEO_ROUTES.includes(pathname) || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const publicPage = isPublicRoute(pathname);

  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (publicPage) {
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|logo.svg|.*\\..*).*)"],
};
