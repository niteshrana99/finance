-- AlterTable
ALTER TABLE "Accounts" ADD COLUMN     "plaidId" TEXT;

-- AlterTable
ALTER TABLE "Categories" ALTER COLUMN "plaidId" DROP NOT NULL;
