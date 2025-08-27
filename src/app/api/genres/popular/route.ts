// /api/genres/popular
import { prisma } from "@/lib/db";

export async function GET() {
  const musicians = await prisma.musician.findMany({
    select: { genres: true },
  });

  // Flatten all genre arrays
  const genreCounts: Record<string, number> = {};
  musicians.forEach((m) => {
    m.genres
      .filter((g) => g && g.trim() !== "") // <-- skip empty
      .forEach((g) => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });
  });

  // Convert to array + sort by count
  const sorted = Object.entries(genreCounts)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count);

  return Response.json(sorted);
}
