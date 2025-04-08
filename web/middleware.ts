import { withAuth } from "next-auth/middleware";
import type { NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { env } from "./env";

const debug = env.DEBUG_MIDDLEWARE;

async function middleware(req: NextRequestWithAuth) {
  const { nextauth, url } = req;
  if (debug) console.log("[MIDDLEWARE]", req.url, nextauth);
  const token = nextauth.token?.access_token;
  // TODO: more stringent checks
  const isAuthed = Boolean(token?.length);

  if (isAuthed) return NextResponse.next();

  if (debug) console.log("[MIDDLEWARE] UNAUTHED REDIRECT");
  return NextResponse.redirect(new URL("/auth/login", url));
}

export default withAuth(middleware);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - auth
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|auth).*)",
  ],
};
