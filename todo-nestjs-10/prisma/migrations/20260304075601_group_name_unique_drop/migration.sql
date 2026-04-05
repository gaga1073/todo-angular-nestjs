/*
  Warnings:

  - You are about to alter the column `name` on the `groups` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.

*/
-- DropIndex
DROP INDEX "groups_name_key";

-- AlterTable
ALTER TABLE "groups" ALTER COLUMN "name" SET DATA TYPE VARCHAR(30);
