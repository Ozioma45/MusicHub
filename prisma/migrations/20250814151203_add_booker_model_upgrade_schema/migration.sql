-- DropForeignKey
ALTER TABLE "public"."Booking" DROP CONSTRAINT "Booking_clientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Booking" DROP CONSTRAINT "Booking_musicianId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Musician" DROP CONSTRAINT "Musician_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_musicianId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Suggestion" DROP CONSTRAINT "Suggestion_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Booking" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "public"."Musician" ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "bio" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "roles" DROP DEFAULT;

-- CreateTable
CREATE TABLE "public"."Booker" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "bio" TEXT,
    "imageUrl" TEXT,

    CONSTRAINT "Booker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Booker_userId_key" ON "public"."Booker"("userId");

-- CreateIndex
CREATE INDEX "Booker_userId_idx" ON "public"."Booker"("userId");

-- CreateIndex
CREATE INDEX "Booking_clientId_idx" ON "public"."Booking"("clientId");

-- CreateIndex
CREATE INDEX "Booking_musicianId_idx" ON "public"."Booking"("musicianId");

-- CreateIndex
CREATE INDEX "Musician_userId_idx" ON "public"."Musician"("userId");

-- CreateIndex
CREATE INDEX "Review_musicianId_idx" ON "public"."Review"("musicianId");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "public"."Review"("userId");

-- CreateIndex
CREATE INDEX "Suggestion_userId_idx" ON "public"."Suggestion"("userId");

-- AddForeignKey
ALTER TABLE "public"."Musician" ADD CONSTRAINT "Musician_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booker" ADD CONSTRAINT "Booker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_musicianId_fkey" FOREIGN KEY ("musicianId") REFERENCES "public"."Musician"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_musicianId_fkey" FOREIGN KEY ("musicianId") REFERENCES "public"."Musician"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Suggestion" ADD CONSTRAINT "Suggestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
