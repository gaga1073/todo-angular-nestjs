/*
  Warnings:

  - The values [admin] on the enum `WorkspaceRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `owner_id` on the `workspaces` table. All the data in the column will be lost.
  - Added the required column `create_by_id` to the `workspaces` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WorkspaceRole_new" AS ENUM ('owner', 'member');
ALTER TABLE "workspace_group_memberships" ALTER COLUMN "role" TYPE "WorkspaceRole_new" USING ("role"::text::"WorkspaceRole_new");
ALTER TYPE "WorkspaceRole" RENAME TO "WorkspaceRole_old";
ALTER TYPE "WorkspaceRole_new" RENAME TO "WorkspaceRole";
DROP TYPE "WorkspaceRole_old";
COMMIT;

-- AlterTable
ALTER TABLE "workspaces" DROP COLUMN "owner_id",
ADD COLUMN     "create_by_id" CHAR(26) NOT NULL;
