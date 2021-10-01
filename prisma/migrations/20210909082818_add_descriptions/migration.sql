/*
  Warnings:

  - You are about to drop the column `name` on the `Gallery` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Art" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Gallery" DROP COLUMN "name",
ADD COLUMN     "artistName" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "galleryName" TEXT;
