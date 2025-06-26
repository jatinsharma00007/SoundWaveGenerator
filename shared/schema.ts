import { pgTable, text, serial, integer, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const audioFiles = pgTable("audio_files", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  category: text("category").notNull(), // 'standard' or 'ambient'
  description: text("description").notNull(),
  usage: text("usage").notNull(),
  duration: real("duration").notNull(),
  fileSize: integer("file_size").notNull(),
  isLoop: boolean("is_loop").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertAudioFileSchema = createInsertSchema(audioFiles).pick({
  filename: true,
  category: true,
  description: true,
  usage: true,
  duration: true,
  fileSize: true,
  isLoop: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type AudioFile = typeof audioFiles.$inferSelect;
export type InsertAudioFile = z.infer<typeof insertAudioFileSchema>;
