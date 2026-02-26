import {
  supporters,
  activities,
  users,
  news,
  proposals,
  events,
  homeContent,
  type InsertSupporter,
  type Supporter,
  type InsertActivity,
  type Activity,
  type User,
  type InsertUser,
  type News,
  type InsertNews,
  type Proposal,
  type InsertProposal,
  type InsertEvent,
  type Event,
  type HomeContent,
  type InsertHomeContent,
} from "@shared/schema";
import { db } from "./db";
import { count, eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createSupporter(supporter: InsertSupporter): Promise<Supporter>;
  getSupportersCount(): Promise<number>;
  getSupporters(): Promise<Supporter[]>;
  
  createActivity(activity: InsertActivity): Promise<Activity>;
  getActivities(): Promise<Activity[]>;

  createNews(news: InsertNews): Promise<News>;
  getNews(): Promise<News[]>;

  createProposal(proposal: InsertProposal): Promise<Proposal>;
  getProposals(): Promise<Proposal[]>;

  deleteActivity(id: number): Promise<void>;
  deleteNews(id: number): Promise<void>;
  deleteProposal(id: number): Promise<void>;

  createEvent(event: InsertEvent): Promise<Event>;
  getEvents(): Promise<Event[]>;

  getHomeContent(): Promise<HomeContent | undefined>;
  updateHomeContent(content: InsertHomeContent): Promise<HomeContent>;

  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new (PostgresSessionStore as any)({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async createSupporter(supporter: InsertSupporter): Promise<Supporter> {
    const [newSupporter] = await db.insert(supporters).values(supporter).returning();
    return newSupporter;
  }

  async getSupportersCount(): Promise<number> {
    const [result] = await db.select({ value: count() }).from(supporters);
    return result.value;
  }

  async getSupporters(): Promise<Supporter[]> {
    return await db.select().from(supporters);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }

  async getActivities(): Promise<Activity[]> {
    return await db.select().from(activities);
  }

  async createNews(newsItem: InsertNews): Promise<News> {
    const [newNews] = await db.insert(news).values(newsItem).returning();
    return newNews;
  }

  async getNews(): Promise<News[]> {
    return await db.select().from(news);
  }

  async createProposal(proposal: InsertProposal): Promise<Proposal> {
    const [newProposal] = await db.insert(proposals).values(proposal).returning();
    return newProposal;
  }

  async getProposals(): Promise<Proposal[]> {
    return await db.select().from(proposals);
  }

  async deleteActivity(id: number): Promise<void> {
    await db.delete(activities).where(eq(activities.id, id));
  }

  async deleteNews(id: number): Promise<void> {
    await db.delete(news).where(eq(news.id, id));
  }

  async deleteProposal(id: number): Promise<void> {
    await db.delete(proposals).where(eq(proposals.id, id));
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  async getEvents(): Promise<Event[]> {
    return await db.select().from(events);
  }

  async getHomeContent(): Promise<HomeContent | undefined> {
    const [content] = await db.select().from(homeContent).limit(1);
    return content;
  }

  async updateHomeContent(content: InsertHomeContent): Promise<HomeContent> {
    const existing = await this.getHomeContent();
    if (existing) {
      const [updated] = await db.update(homeContent).set(content).where(eq(homeContent.id, existing.id)).returning();
      return updated;
    }
    const [newContent] = await db.insert(homeContent).values(content).returning();
    return newContent;
  }
}

export const storage = new DatabaseStorage();
