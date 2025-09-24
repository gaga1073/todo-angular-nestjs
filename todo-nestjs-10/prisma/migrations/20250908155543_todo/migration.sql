/*
  Warnings:

  - Added the required column `create_at` to the `groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `update_at` to the `groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_delete` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MembershipRole" AS ENUM ('owner', 'admin', 'member');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NotStarted', 'InProgress', 'Completed');

-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "create_at" TIMESTAMPTZ NOT NULL,
ADD COLUMN     "update_at" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_delete" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "menberships" (
    "user_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "role" "MembershipRole" NOT NULL,
    "create_at" TIMESTAMPTZ NOT NULL,
    "update_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "menberships_pkey" PRIMARY KEY ("user_id","group_id")
);

-- CreateTable
CREATE TABLE "workspaces" (
    "id" VARCHAR(26) NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "description" TEXT NOT NULL,
    "group_id" CHAR(26) NOT NULL,
    "owner_id" CHAR(26) NOT NULL,
    "create_at" TIMESTAMPTZ NOT NULL,
    "update_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "todos" (
    "id" VARCHAR(26) NOT NULL,
    "title" VARCHAR(30) NOT NULL,
    "workspace_id" CHAR(26) NOT NULL,
    "description" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "due_date" TIMESTAMPTZ NOT NULL,
    "assignee_id" CHAR(26) NOT NULL,
    "create_by" CHAR(26) NOT NULL,
    "create_at" TIMESTAMPTZ NOT NULL,
    "update_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "todos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "menberships" ADD CONSTRAINT "menberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menberships" ADD CONSTRAINT "menberships_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
