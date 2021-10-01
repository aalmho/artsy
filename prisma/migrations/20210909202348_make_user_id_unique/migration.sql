/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Gallery` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Gallery.userId_unique" ON "Gallery"("userId");
