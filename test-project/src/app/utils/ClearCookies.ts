"use server";
import { cookies } from "next/headers";

export default async function ClearCookies() {
  const cookieStore = cookies();
  cookieStore.getAll().forEach((cookie) => {
    cookieStore.delete(cookie.name);
  });
}
