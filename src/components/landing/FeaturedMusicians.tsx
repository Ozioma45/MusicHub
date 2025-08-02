import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";

export default async function FeaturedMusicians() {
  const musicians = await prisma.musician.findMany({
    take: 5,
    orderBy: { name: "asc" },
  });

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12">Featured Musicians</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          {musicians.map((musician: any) => (
            <div
              key={musician.id}
              className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden"
            >
              <img
                src={musician.coverImage || "/default-cover.jpg"}
                alt={musician.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 text-left">
                <h3 className="text-lg font-semibold">{musician.name}</h3>
                <p className="text-sm text-gray-600">
                  {musician.genre} • {musician.location}
                </p>
                <Link
                  href={`/musician/${musician.id}`}
                  className="text-blue-600 mt-2 inline-block"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/explore"
          className="font-semibold text-muted-foreground hover:text-foreground"
        >
          View All Musicians
        </Link>
      </div>
    </section>
  );
}
