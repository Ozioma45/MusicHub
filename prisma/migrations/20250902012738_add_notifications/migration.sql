/*
  Warnings:

  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('BOOKING', 'MESSAGE', 'REVIEW', 'SYSTEM');

-- AlterTable
ALTER TABLE "public"."Notification" ADD COLUMN     "type" "public"."NotificationType" NOT NULL;
