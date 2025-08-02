import { prisma } from "@/lib/db";

export async function GET() {
  const genres = await prisma.musician.groupBy({
    by: ["genre"],
    _count: { genre: true },
    orderBy: { _count: { genre: "desc" } },
  });

  return Response.json(genres);
}
