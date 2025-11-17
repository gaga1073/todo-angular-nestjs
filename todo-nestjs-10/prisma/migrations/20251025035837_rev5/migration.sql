/*
  Warnings:

  - Added the required column `group_classification` to the `groups` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GroupClassification" AS ENUM ('private', 'public');

-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "group_classification" "GroupClassification" NOT NULL;
