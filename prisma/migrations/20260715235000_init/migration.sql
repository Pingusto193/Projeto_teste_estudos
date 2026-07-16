/*
  Warnings:

  - You are about to drop the `Friendship` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `telefone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "amigosStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_addresseeId_fkey";

-- DropForeignKey
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_requesterId_fkey";

-- AlterTable
ALTER TABLE "Estudos" ALTER COLUMN "start" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "telefone" TEXT NOT NULL;

-- DropTable
DROP TABLE "Friendship";

-- DropEnum
DROP TYPE "FriendshipStatus";

-- CreateTable
CREATE TABLE "amigos" (
    "id" SERIAL NOT NULL,
    "requesterId" INTEGER NOT NULL,
    "addresseeId" INTEGER NOT NULL,
    "status" "amigosStatus" NOT NULL DEFAULT 'PENDING',
    "start" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "amigos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "amigos_addresseeId_idx" ON "amigos"("addresseeId");

-- CreateIndex
CREATE UNIQUE INDEX "amigos_requesterId_addresseeId_key" ON "amigos"("requesterId", "addresseeId");

-- AddForeignKey
ALTER TABLE "amigos" ADD CONSTRAINT "amigos_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "amigos" ADD CONSTRAINT "amigos_addresseeId_fkey" FOREIGN KEY ("addresseeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
