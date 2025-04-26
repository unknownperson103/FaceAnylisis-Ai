import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Face Analysis model
export const faceAnalysis = pgTable("face_analysis", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  imageUrl: text("image_url"),
  analysisData: jsonb("analysis_data").$type<FaceAnalysisData>(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const insertFaceAnalysisSchema = createInsertSchema(faceAnalysis).pick({
  userId: true,
  imageUrl: true,
  analysisData: true,
});

// Face Analysis Data Types
export interface FaceFeatureAnalysis {
  label: string;
  value: string;
}

export interface FaceRating {
  category: string;
  score: number;
  percentage: number;
}

export interface FaceRecommendation {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface FaceAnalysisData {
  features: FaceFeatureAnalysis[];
  ratings: FaceRating[];
  recommendations: FaceRecommendation[];
}

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertFaceAnalysis = z.infer<typeof insertFaceAnalysisSchema>;
export type FaceAnalysis = typeof faceAnalysis.$inferSelect;
