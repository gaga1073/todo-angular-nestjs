-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'general');

-- CreateEnum
CREATE TYPE "GroupClassification" AS ENUM ('private', 'public');

-- CreateEnum
CREATE TYPE "WorkspaceRole" AS ENUM ('owner', 'member');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NotStarted', 'InProgress', 'Completed');

-- CreateTable
CREATE TABLE "users" (
    "id" CHAR(26) NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "role" "UserRole" NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "password" VARCHAR(60) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "create_at" TIMESTAMPTZ NOT NULL,
    "update_at" TIMESTAMPTZ NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" CHAR(26) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "group_classification" "GroupClassification" NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "create_at" TIMESTAMPTZ NOT NULL,
    "update_at" TIMESTAMPTZ NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_groups" (
    "user_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,

    CONSTRAINT "user_groups_pkey" PRIMARY KEY ("user_id","group_id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" VARCHAR(26) NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "description" TEXT NOT NULL,
    "group_id" CHAR(26) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "create_by_id" CHAR(26) NOT NULL,
    "create_at" TIMESTAMPTZ NOT NULL,
    "update_at" TIMESTAMPTZ NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "todos" (
    "id" VARCHAR(26) NOT NULL,
    "title" VARCHAR(30) NOT NULL,
    "group_id" CHAR(26) NOT NULL,
    "description" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "due_date" DATE NOT NULL,
    "assignee_id" CHAR(26) NOT NULL,
    "create_by_id" CHAR(26) NOT NULL,
    "create_at" TIMESTAMPTZ NOT NULL,
    "update_at" TIMESTAMPTZ NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "todos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "groups_name_key" ON "groups"("name");

-- AddForeignKey
ALTER TABLE "user_groups" ADD CONSTRAINT "user_groups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_groups" ADD CONSTRAINT "user_groups_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_create_by_id_fkey" FOREIGN KEY ("create_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
