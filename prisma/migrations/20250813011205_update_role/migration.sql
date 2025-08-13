-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "roles" SET DEFAULT ARRAY[]::"public"."Role"[];
