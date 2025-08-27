// /api/genres
import { prisma } from "@/lib/db";

export async function GET() {
  const musicians = await prisma.musician.findMany({
    select: { genres: true },
  });

  // Count all genres, ignoring empty strings
  const genreCounts: Record<string, number> = {};
  musicians.forEach((m) => {
    m.genres
      .filter((g) => g && g.trim() !== "") // <-- skip empty
      .forEach((g) => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });
  });

  // Convert into array + sort
  const sorted = Object.entries(genreCounts)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count);

  return Response.json(sorted);
}
