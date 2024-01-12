import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: "/chzzk-api/:path*",
};

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/chzzk-api")) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Origin", "https://chzzk.naver.com");
    requestHeaders.set("Referer", "https://chzzk.naver.com/");
    if (requestHeaders.has("Sec-Fetch-Site")) {
      requestHeaders.set("Sec-Fetch-Site", "same-site");
    }
    return NextResponse.rewrite(
      `https://api.chzzk.naver.com${pathname.substring("/chzzk-api".length)}${
        request.nextUrl.search
      }`,
      {
        request: {
          headers: requestHeaders,
        },
      },
    );
  }
}
