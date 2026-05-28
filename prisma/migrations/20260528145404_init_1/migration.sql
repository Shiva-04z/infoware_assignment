-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'User');

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'User';
