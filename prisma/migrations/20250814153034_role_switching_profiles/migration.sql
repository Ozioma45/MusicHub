-- AlterTable
ALTER TABLE "public"."Musician" ALTER COLUMN "mediaUrls" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "genres" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "instruments" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "services" SET DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "activeRole" "public"."Role",
ALTER COLUMN "roles" SET DEFAULT ARRAY[]::"public"."Role"[];
