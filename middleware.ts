import cookieKeys from "@/configs/cookieKeys";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest, _: NextResponse) {
  const session = request.cookies.get(cookieKeys.USER_TOKEN);

  const onlyPublicRoutes = ["/login", "/sign-up"];

  const isOnlyPublic = onlyPublicRoutes.includes(request.nextUrl.pathname);

  if (!session && !isOnlyPublic) {
    const url = new URL("/login", request.url);

    // Preserve all existing query parameters
    for (const [key, value] of request.nextUrl.searchParams.entries()) {
      url.searchParams.append(key, value);
    }

    // Add redirect_to parameter if it's not already present
    if (!url.searchParams.has("redirect_to")) {
      url.searchParams.set("redirect_to", request.nextUrl.pathname);
    }

    return NextResponse.redirect(url);
  }

  if (session && isOnlyPublic) {
    return NextResponse.redirect(new URL(`/`, request.url));
  }

  if (session && !isOnlyPublic) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/login/:paths*", "/sign-up/:paths*", "/protected/:paths*"],
};
