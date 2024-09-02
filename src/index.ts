import { Elysia, t } from "elysia";
import { db } from "./db";
import { todo } from "./schema";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { eq } from "drizzle-orm";

await migrate(db, {
  migrationsFolder: "./drizzle",
});

const app = new Elysia()
  .get("/todos", async () => await db.select().from(todo))
  .get(
    "/todos/:id",
    async ({ params: { id } }) =>
      await db.query.todo.findFirst({
        where: eq(todo.id, Number.parseInt(id)),
      })
  )
  .post(
    "/todos",
    async ({ body }) => await db.insert(todo).values(body).returning(),
    {
      body: t.Object({
        title: t.String(),
        description: t.String(),
      }),
    }
  )
  .patch(
    "/todos/:id",
    ({ params: { id }, body }) =>
      db
        .update(todo)
        .set(body)
        .where(eq(todo.id, Number.parseInt(id)))
        .returning(),
    {
      body: t.Object({
        title: t.Optional(t.String()),
        description: t.Optional(t.String()),
        completed: t.Optional(t.Boolean()),
      }),
    }
  )
  .delete("/todos/:id", async ({ params: { id } }) => {
    await db.delete(todo).where(eq(todo.id, Number.parseInt(id)));
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
