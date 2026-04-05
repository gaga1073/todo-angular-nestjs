/*
  Warnings:

  - You are about to drop the column `group_id` on the `todos` table. All the data in the column will be lost.
  - Added the required column `project_id` to the `todos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "todos" DROP CONSTRAINT "todos_group_id_fkey";

-- AlterTable
ALTER TABLE "todos" DROP COLUMN "group_id",
ADD COLUMN     "project_id" CHAR(26) NOT NULL;

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
