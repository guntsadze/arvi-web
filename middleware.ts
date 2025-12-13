import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 🔍 Cookie-დან token-ის წამოღება
  const token = request.cookies.get("token")?.value;

  const { pathname } = request.nextUrl;

  // 📋 Public routes (ავტორიზაციის გარეშე ხელმისაწვდომი)
  const publicRoutes = ["/login", "/register", "/forgot-password"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // ✅ თუ public route-ზე ვართ და token არსებობს → redirect home-ზე
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ❌ თუ protected route-ზე ვართ და token არ არსებობს → redirect login-ზე
  if (!isPublicRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    // 🔗 Save redirect URL (optional - სადაც უნდოდა წასვლა)
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ ყველაფერი რიგზეა
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/auth).*)"],
};
