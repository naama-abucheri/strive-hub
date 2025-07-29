import {
  users,
  goals,
  habits,
  habitCompletions,
  type User,
  type UpsertUser,
  type Goal,
  type InsertGoal,
  type Habit,
  type InsertHabit,
  type HabitCompletion,
  type InsertHabitCompletion,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, gte, lte } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Goal operations
  getGoals(userId: string): Promise<Goal[]>;
  getGoal(id: string, userId: string): Promise<Goal | undefined>;
  createGoal(goal: InsertGoal, userId: string): Promise<Goal>;
  updateGoal(id: string, userId: string, updates: Partial<InsertGoal>): Promise<Goal>;
  deleteGoal(id: string, userId: string): Promise<void>;
  
  // Habit operations
  getHabits(userId: string): Promise<Habit[]>;
  getHabit(id: string, userId: string): Promise<Habit | undefined>;
  createHabit(habit: InsertHabit, userId: string): Promise<Habit>;
  updateHabit(id: string, userId: string, updates: Partial<InsertHabit>): Promise<Habit>;
  deleteHabit(id: string, userId: string): Promise<void>;
  
  // Habit completion operations
  getHabitCompletions(habitId: string): Promise<HabitCompletion[]>;
  getHabitCompletionsForDate(habitId: string, date: string): Promise<HabitCompletion[]>;
  createHabitCompletion(completion: InsertHabitCompletion): Promise<HabitCompletion>;
  deleteHabitCompletion(habitId: string, date: string): Promise<void>;
  
  // Analytics operations
  getHabitStreaks(userId: string): Promise<{ habitId: string; currentStreak: number; longestStreak: number }[]>;
  getWeeklyHabitCompletions(userId: string, startDate: string, endDate: string): Promise<{ date: string; completions: number }[]>;
  getHabitCategoryCounts(userId: string): Promise<{ category: string; count: number }[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Goal operations
  async getGoals(userId: string): Promise<Goal[]> {
    return await db.select().from(goals).where(eq(goals.userId, userId)).orderBy(desc(goals.createdAt));
  }

  async getGoal(id: string, userId: string): Promise<Goal | undefined> {
    const [goal] = await db.select().from(goals).where(and(eq(goals.id, id), eq(goals.userId, userId)));
    return goal;
  }

  async createGoal(goal: InsertGoal, userId: string): Promise<Goal> {
    const [newGoal] = await db.insert(goals).values({ ...goal, userId }).returning();
    return newGoal;
  }

  async updateGoal(id: string, userId: string, updates: Partial<InsertGoal>): Promise<Goal> {
    const [updatedGoal] = await db
      .update(goals)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(goals.id, id), eq(goals.userId, userId)))
      .returning();
    return updatedGoal;
  }

  async deleteGoal(id: string, userId: string): Promise<void> {
    await db.delete(goals).where(and(eq(goals.id, id), eq(goals.userId, userId)));
  }

  // Habit operations
  async getHabits(userId: string): Promise<Habit[]> {
    return await db.select().from(habits).where(eq(habits.userId, userId)).orderBy(desc(habits.createdAt));
  }

  async getHabit(id: string, userId: string): Promise<Habit | undefined> {
    const [habit] = await db.select().from(habits).where(and(eq(habits.id, id), eq(habits.userId, userId)));
    return habit;
  }

  async createHabit(habit: InsertHabit, userId: string): Promise<Habit> {
    const [newHabit] = await db.insert(habits).values({ ...habit, userId }).returning();
    return newHabit;
  }

  async updateHabit(id: string, userId: string, updates: Partial<InsertHabit>): Promise<Habit> {
    const [updatedHabit] = await db
      .update(habits)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(habits.id, id), eq(habits.userId, userId)))
      .returning();
    return updatedHabit;
  }

  async deleteHabit(id: string, userId: string): Promise<void> {
    await db.delete(habits).where(and(eq(habits.id, id), eq(habits.userId, userId)));
  }

  // Habit completion operations
  async getHabitCompletions(habitId: string): Promise<HabitCompletion[]> {
    return await db.select().from(habitCompletions).where(eq(habitCompletions.habitId, habitId)).orderBy(desc(habitCompletions.completedAt));
  }

  async getHabitCompletionsForDate(habitId: string, date: string): Promise<HabitCompletion[]> {
    return await db.select().from(habitCompletions).where(
      and(
        eq(habitCompletions.habitId, habitId),
        eq(habitCompletions.completedAt, date)
      )
    );
  }

  async createHabitCompletion(completion: InsertHabitCompletion): Promise<HabitCompletion> {
    const [newCompletion] = await db.insert(habitCompletions).values(completion).returning();
    return newCompletion;
  }

  async deleteHabitCompletion(habitId: string, date: string): Promise<void> {
    await db.delete(habitCompletions).where(
      and(
        eq(habitCompletions.habitId, habitId),
        eq(habitCompletions.completedAt, date)
      )
    );
  }

  // Analytics operations
  async getHabitStreaks(userId: string): Promise<{ habitId: string; currentStreak: number; longestStreak: number }[]> {
    // This is a simplified implementation - in a real app you'd want more sophisticated streak calculation
    const userHabits = await db.select().from(habits).where(eq(habits.userId, userId));
    const results = [];

    for (const habit of userHabits) {
      const completions = await db.select().from(habitCompletions)
        .where(eq(habitCompletions.habitId, habit.id))
        .orderBy(desc(habitCompletions.completedAt));

      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      
      // Calculate streaks (simplified logic)
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      // Check if completed today or yesterday for current streak
      if (completions.some(c => c.completedAt === today || c.completedAt === yesterday)) {
        currentStreak = 1; // Simplified - would need more complex logic for real streaks
      }

      longestStreak = Math.max(completions.length > 0 ? 1 : 0, tempStreak);

      results.push({
        habitId: habit.id,
        currentStreak,
        longestStreak
      });
    }

    return results;
  }

  async getWeeklyHabitCompletions(userId: string, startDate: string, endDate: string): Promise<{ date: string; completions: number }[]> {
    const userHabits = await db.select().from(habits).where(eq(habits.userId, userId));
    const habitIds = userHabits.map(h => h.id);

    if (habitIds.length === 0) return [];

    const completions = await db.select({
      date: habitCompletions.completedAt,
      count: sql<number>`count(*)::int`,
    })
    .from(habitCompletions)
    .where(
      and(
        sql`${habitCompletions.habitId} = ANY(${habitIds})`,
        gte(habitCompletions.completedAt, startDate),
        lte(habitCompletions.completedAt, endDate)
      )
    )
    .groupBy(habitCompletions.completedAt);

    return completions.map(c => ({ date: c.date, completions: c.count }));
  }

  async getHabitCategoryCounts(userId: string): Promise<{ category: string; count: number }[]> {
    const results = await db.select({
      category: habits.category,
      count: sql<number>`count(*)::int`,
    })
    .from(habits)
    .where(eq(habits.userId, userId))
    .groupBy(habits.category);

    return results;
  }
}

export const storage = new DatabaseStorage();
