/*
  Warnings:

  - You are about to drop the `user_group_memberships` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workspace_group_memberships` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_group_memberships" DROP CONSTRAINT "user_group_memberships_group_id_fkey";

-- DropForeignKey
ALTER TABLE "user_group_memberships" DROP CONSTRAINT "user_group_memberships_user_id_fkey";

-- DropForeignKey
ALTER TABLE "workspace_group_memberships" DROP CONSTRAINT "workspace_group_memberships_group_id_fkey";

-- DropForeignKey
ALTER TABLE "workspace_group_memberships" DROP CONSTRAINT "workspace_group_memberships_workspace_id_fkey";

-- DropTable
DROP TABLE "user_group_memberships";

-- DropTable
DROP TABLE "workspace_group_memberships";

-- CreateTable
CREATE TABLE "user_group_models" (
    "user_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,

    CONSTRAINT "user_group_models_pkey" PRIMARY KEY ("user_id","group_id")
);

-- CreateTable
CREATE TABLE "group_workspace_models" (
    "workspace_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "role" "WorkspaceRole" NOT NULL,

    CONSTRAINT "group_workspace_models_pkey" PRIMARY KEY ("workspace_id","group_id")
);

-- AddForeignKey
ALTER TABLE "user_group_models" ADD CONSTRAINT "user_group_models_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_group_models" ADD CONSTRAINT "user_group_models_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_workspace_models" ADD CONSTRAINT "group_workspace_models_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_workspace_models" ADD CONSTRAINT "group_workspace_models_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
