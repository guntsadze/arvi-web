export const PUBLIC_ROUTES = [
  "/",
  "/feed",
  "/posts",
  "/groups",
  "/cars",
  "/marketplace",
  "/listings",
  "/profile",
  "/user",
  "/login",
  "/register",
];

export const AUTH_ROUTES = ["/login", "/register"];

export const SEO_ROUTES = [
  "/robots.txt",
  "/sitemap.xml",
  "/favicon.ico",
  "/logo.svg",
];

export const isPublicRoute = (pathname: string) => {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
};
