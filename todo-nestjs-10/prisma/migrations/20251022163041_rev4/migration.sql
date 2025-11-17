/*
  Warnings:

  - You are about to drop the `group_workspace_models` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_group_models` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "group_workspace_models" DROP CONSTRAINT "group_workspace_models_group_id_fkey";

-- DropForeignKey
ALTER TABLE "group_workspace_models" DROP CONSTRAINT "group_workspace_models_workspace_id_fkey";

-- DropForeignKey
ALTER TABLE "user_group_models" DROP CONSTRAINT "user_group_models_group_id_fkey";

-- DropForeignKey
ALTER TABLE "user_group_models" DROP CONSTRAINT "user_group_models_user_id_fkey";

-- DropTable
DROP TABLE "group_workspace_models";

-- DropTable
DROP TABLE "user_group_models";

-- CreateTable
CREATE TABLE "user_groups" (
    "user_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,

    CONSTRAINT "user_groups_pkey" PRIMARY KEY ("user_id","group_id")
);

-- CreateTable
CREATE TABLE "group_workspaces" (
    "workspace_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "role" "WorkspaceRole" NOT NULL,

    CONSTRAINT "group_workspaces_pkey" PRIMARY KEY ("workspace_id","group_id")
);

-- AddForeignKey
ALTER TABLE "user_groups" ADD CONSTRAINT "user_groups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_groups" ADD CONSTRAINT "user_groups_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_workspaces" ADD CONSTRAINT "group_workspaces_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_workspaces" ADD CONSTRAINT "group_workspaces_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
