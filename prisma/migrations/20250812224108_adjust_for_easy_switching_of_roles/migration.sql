/*
  Warnings:

  - You are about to drop the column `genre` on the `Musician` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Musician" DROP COLUMN "genre",
ADD COLUMN     "genres" TEXT[],
ADD COLUMN     "instruments" TEXT[],
ADD COLUMN     "services" TEXT[];

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "role",
ADD COLUMN     "roles" "public"."Role"[];
