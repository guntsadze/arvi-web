import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_ROUTES, SEO_ROUTES, isPublicRoute } from "@/constants/routes";

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;

  if (
    pathname.includes(".") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  const isPublic = isPublicRoute(pathname);

  if (isPublic) {
    if (token && AUTH_ROUTES.includes(pathname)) {
      return NextResponse.redirect(new URL("/feed", request.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
