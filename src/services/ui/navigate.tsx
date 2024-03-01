"use server";
import { redirect } from "next/navigation";

export async function navigateRoute(url: string) {
  redirect(url);
}
