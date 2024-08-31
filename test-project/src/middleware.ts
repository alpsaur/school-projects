import { NextRequest, NextResponse } from "next/server";
import { currentAuthSession } from "@/app/utils/auth";

export async function middleware(request: NextRequest) {
  let ownerId: string = "";
  let cognitoGroupsString: string = "";
  const requestHeaders = new Headers(request.headers);

  if (request.nextUrl.pathname.startsWith("/login")) {
    const session = await currentAuthSession(request);
    ownerId = session?.userSub ? session?.userSub : "";
    requestHeaders.set("X-IBIS-ID", ownerId);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  if (request.nextUrl.pathname.startsWith("/logout")) {
    requestHeaders.set("X-IBIS-ID", "");
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  // console.debug("2. i am non login middleware");
  // console.debug("2.1 pathname:", request.nextUrl.pathname);

  // get AuthSession if not in login path
  const session = await currentAuthSession(request);

  // check for session object. if session object have tokens, then proceed to seed, if dont have then redirect for routes that have auth
  if (session?.tokens === undefined) {
    // console.debug("3.1 i hit redirect");
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // console.log("sessionObj", session);
  if (session?.userSub) {
    ownerId = session?.userSub;
  }
  if (session?.tokens?.idToken?.payload) {
    // console.log("accessToken payload", session?.tokens?.accessToken?.payload);
    const payload = session?.tokens?.accessToken?.payload;
    // console.log("payload type:", typeof payload);
    // next time to check if 1 person have multiple groups
    if ("cognito:groups" in payload) {
      cognitoGroupsString = payload["cognito:groups"]
        ? payload["cognito:groups"]?.toString()
        : "";
    }
  }
  requestHeaders.set("X-IBIS-USERGROUP", cognitoGroupsString);
  requestHeaders.set("X-IBIS-ID", ownerId);

  // console.debug(cognitoGroupsString);
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
// need to make sure all minor paths are conisdered
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|$|about|images).*)",
  ],
};
