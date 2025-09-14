import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET!;

export async function GET() {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return NextResponse.json({ admin: decoded });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
