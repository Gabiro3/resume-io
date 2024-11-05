import {
    date,
    integer,
    pgTable,
    serial,
    text,
    varchar,
  } from "drizzle-orm/pg-core";
  import { documentTable } from "./document";
  import { relations } from "drizzle-orm";
  import { createInsertSchema } from "drizzle-zod";
  import { z } from "zod";
  
  export const activityTable = pgTable("activity", {
    id: serial("id").primaryKey(),
    docId: integer("document_id")
      .references(() => documentTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
    activityName: varchar("activity_name", { length: 255 }),
    description: text("description"),
    startDate: date("start_date"),
    endDate: date("end_date"),
  });
  
  export const activityRelations = relations(activityTable, ({ one }) => ({
    document: one(documentTable, {
      fields: [activityTable.docId],
      references: [documentTable.id],
    }),
  }));
  
  export const activityTableSchema = createInsertSchema(activityTable, {
    id: z.number().optional(),
  }).pick({
    id: true,
    activityName: true,
    description: true,
    startDate: true,
    endDate: true,
  });
  
  export type ActivitySchema = z.infer<typeof activityTableSchema>;