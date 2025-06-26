import { users, type User, type InsertUser, type AudioFile, type InsertAudioFile } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllAudioFiles(): Promise<AudioFile[]>;
  createAudioFile(audioFile: InsertAudioFile): Promise<AudioFile>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private audioFiles: Map<number, AudioFile>;
  private currentUserId: number;
  private currentAudioFileId: number;

  constructor() {
    this.users = new Map();
    this.audioFiles = new Map();
    this.currentUserId = 1;
    this.currentAudioFileId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllAudioFiles(): Promise<AudioFile[]> {
    return Array.from(this.audioFiles.values());
  }

  async createAudioFile(insertAudioFile: InsertAudioFile): Promise<AudioFile> {
    const id = this.currentAudioFileId++;
    const audioFile: AudioFile = { ...insertAudioFile, id };
    this.audioFiles.set(id, audioFile);
    return audioFile;
  }
}

export const storage = new MemStorage();
