import { prisma } from "@/lib/db";

export async function GET() {
  const genres = await prisma.musician.groupBy({
    by: ["genres"],
    _count: { genres: true },
    orderBy: { _count: { genres: "desc" } },
  });

  return Response.json(genres);
}
