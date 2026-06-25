import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Redirect authenticated users away from auth pages
    if (token && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
      return NextResponse.redirect(new URL("/chat", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        const protectedPaths = ["/chat", "/dashboard", "/settings"];

        // Allow auth pages and home page
        if (pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/register")) {
          return true;
        }

        // Check if path is protected
        const isProtected = protectedPaths.some((path) =>
          pathname.startsWith(path)
        );

        if (isProtected) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};