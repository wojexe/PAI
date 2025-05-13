import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const capsulesTable = sqliteTable("capsules", {
  id: int().primaryKey({ autoIncrement: true }),
  content: text().notNull(),
  folderName: text().notNull(),
  publishDate: text().notNull(), // ISO date string
});

export const capsulesFilesTable = sqliteTable("capsules_files", {
  id: int().primaryKey({ autoIncrement: true }),
  fileName: text({ length: 64 }).notNull(),
  contentType: text({
    enum: ["image", "video", "audio"],
  }).notNull(),
  capsuleId: int()
    .notNull()
    .references(() => capsulesTable.id),
});
