-- DropForeignKey
ALTER TABLE "todos" DROP CONSTRAINT "todos_assignee_id_fkey";

-- AlterTable
ALTER TABLE "todos" ALTER COLUMN "assignee_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
