"use server";

import { cookies } from "next/headers";

function clearCookieStorage() {
  const cookieStore = cookies();
  // clear the session cookie
  cookieStore.getAll().forEach((cookie) => {
    cookieStore.delete(cookie.name);
  });
}

export { clearCookieStorage };
