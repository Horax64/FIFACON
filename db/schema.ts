import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const siteContent = sqliteTable('site_content', {
 id: text('id').primaryKey(), body: text('body').notNull(), version: integer('version').notNull().default(0),
 updatedAt: text('updated_at').notNull(), updatedBy: text('updated_by').notNull(),
});
