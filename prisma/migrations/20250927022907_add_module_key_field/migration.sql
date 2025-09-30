/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `modules` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the table `modules` without a default value. This is not possible if the table is not empty.

*/

-- Add column with default value
ALTER TABLE "modules" ADD COLUMN "key" TEXT;

-- Update existing modules with their key values
UPDATE "modules" SET "key" = LOWER("name") WHERE "key" IS NULL;

-- Make the column NOT NULL after updating all rows
ALTER TABLE "modules" ALTER COLUMN "key" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "modules_key_key" ON "modules"("key");