/*
  Warnings:

  - Added the required column `workspace_classification` to the `workspaces` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WorkspaceClassification" AS ENUM ('private', 'public');

-- AlterTable
ALTER TABLE "workspaces" ADD COLUMN     "workspace_classification" "WorkspaceClassification" NOT NULL;
