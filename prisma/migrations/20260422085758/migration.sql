/*
  Warnings:

  - You are about to drop the column `emailCerified` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Advertisement" ADD COLUMN     "moderatedById" TEXT,
ADD COLUMN     "moderationNote" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailCerified",
ADD COLUMN     "emailVerified" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "Advertisement" ADD CONSTRAINT "Advertisement_moderatedById_fkey" FOREIGN KEY ("moderatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
