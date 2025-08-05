import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import MainLayout from "@/components/MainLayout";
import Image from "next/image";

export default async function ViewMusicianProfilePage() {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
    include: { musician: true },
  });

  if (!dbUser || dbUser.role !== "MUSICIAN" || !dbUser.musician) {
    redirect("/dashboard");
  }

  const musician = dbUser.musician;

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">🎧 Your Profile</h1>

        {/* ✅ Show Cover Image if available */}
        {musician.coverImage && (
          <div className="w-full h-60 relative rounded-lg overflow-hidden mb-6">
            <Image
              src={musician.coverImage}
              alt="Cover"
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="space-y-2">
          <p>
            <strong>Name:</strong> {musician.name}
          </p>
          <p>
            <strong>Genre:</strong> {musician.genre}
          </p>
          <p>
            <strong>Location:</strong> {musician.location}
          </p>
          <p>
            <strong>Bio:</strong> {musician.bio}
          </p>
          <div>
            <strong>Media URLs:</strong>
            <ul className="list-disc pl-5">
              {musician.mediaUrls.map((url: string, index: number) => (
                <li key={index}>
                  <a
                    href={url}
                    className="text-blue-500 underline"
                    target="_blank"
                  >
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
