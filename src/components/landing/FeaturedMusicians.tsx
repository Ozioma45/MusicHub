import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";

type Musician = {
  id: string;
  name: string;
  genre: string;
  location: string;
  coverImage?: string | null;
};

export default async function FeaturedMusicians() {
  const musicians: Musician[] = await prisma.musician.findMany({
    take: 5,
    orderBy: { name: "asc" },
  });

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12">Featured Musicians</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          {musicians.map((musician) => (
            <div
              key={musician.id}
              className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden"
            >
              <Image
                src={musician.coverImage || "/default-cover.jpg"}
                alt={musician.name}
                width={400}
                height={160}
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

        <div className="mt-8 sm:mt-10 md:mt-12">
          <Link
            href="/explore"
            className="font-semibold text-muted-foreground hover:text-foreground"
          >
            View All Musicians
          </Link>
        </div>
      </div>
    </section>
  );
}
