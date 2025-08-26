/*
  Warnings:

  - You are about to drop the column `bookerId` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `musicianId` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `readByBooker` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `readByMusician` on the `Conversation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userAId,userBId]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userAId` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userBId` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Conversation" DROP CONSTRAINT "Conversation_bookerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Conversation" DROP CONSTRAINT "Conversation_musicianId_fkey";

-- AlterTable
ALTER TABLE "public"."Conversation" DROP COLUMN "bookerId",
DROP COLUMN "musicianId",
DROP COLUMN "readByBooker",
DROP COLUMN "readByMusician",
ADD COLUMN     "readByA" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "readByB" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "userAId" TEXT NOT NULL,
ADD COLUMN     "userBId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_userAId_userBId_key" ON "public"."Conversation"("userAId", "userBId");

-- AddForeignKey
ALTER TABLE "public"."Conversation" ADD CONSTRAINT "Conversation_userAId_fkey" FOREIGN KEY ("userAId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Conversation" ADD CONSTRAINT "Conversation_userBId_fkey" FOREIGN KEY ("userBId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
