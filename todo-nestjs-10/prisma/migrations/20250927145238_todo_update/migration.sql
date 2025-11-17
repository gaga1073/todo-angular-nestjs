/*
  Warnings:

  - You are about to drop the column `create_by` on the `todos` table. All the data in the column will be lost.
  - Added the required column `create_by_id` to the `todos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "todos" DROP COLUMN "create_by",
ADD COLUMN     "create_by_id" CHAR(26) NOT NULL;

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_create_by_id_fkey" FOREIGN KEY ("create_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
