/*
  Warnings:

  - You are about to drop the `menberships` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "menberships" DROP CONSTRAINT "menberships_group_id_fkey";

-- DropForeignKey
ALTER TABLE "menberships" DROP CONSTRAINT "menberships_user_id_fkey";

-- DropTable
DROP TABLE "menberships";

-- CreateTable
CREATE TABLE "memberships" (
    "user_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "role" "MembershipRole" NOT NULL,
    "create_at" TIMESTAMPTZ NOT NULL,
    "update_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("user_id","group_id")
);

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
