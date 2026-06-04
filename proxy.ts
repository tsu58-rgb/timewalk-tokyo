import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const REMOVED_SHONEN_YAMADA_PATH = "/shonen-yamada";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.rewrite(new URL("/timewalk-home", request.url));
  }

  if (
    pathname === REMOVED_SHONEN_YAMADA_PATH ||
    pathname.startsWith(`${REMOVED_SHONEN_YAMADA_PATH}/`)
  ) {
    return NextResponse.rewrite(new URL("/_not-found", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/shonen-yamada/:path*"],
};
