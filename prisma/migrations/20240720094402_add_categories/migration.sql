-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "plaidId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);
