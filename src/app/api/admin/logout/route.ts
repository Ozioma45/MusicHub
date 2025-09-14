import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  (await cookies()).set("admin_token", "", { maxAge: 0, path: "/" });
  return NextResponse.json({ success: true });
}
