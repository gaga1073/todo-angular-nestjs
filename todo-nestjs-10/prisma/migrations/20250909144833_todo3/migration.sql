-- DropForeignKey
ALTER TABLE "workspaces" DROP CONSTRAINT "workspaces_group_id_fkey";

-- AlterTable
ALTER TABLE "workspaces" ALTER COLUMN "group_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
