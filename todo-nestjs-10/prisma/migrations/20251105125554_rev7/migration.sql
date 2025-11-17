-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_create_by_id_fkey" FOREIGN KEY ("create_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
