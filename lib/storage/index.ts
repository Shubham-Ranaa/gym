import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(process.cwd(), 'data');

export function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getDataFilePath(filename: string): string {
  return path.join(DATA_DIR, filename);
}

export function readJsonFile<T>(filename: string): T[] {
  ensureDataDir();
  const filePath = getDataFilePath(filename);
  
  if (!fs.existsSync(filePath)) {
    return [];
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
}

export function writeJsonFile<T>(filename: string, data: T[]): boolean {
  ensureDataDir();
  const filePath = getDataFilePath(filename);
  
  try {
    const tempPath = `${filePath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
}

export function appendToJsonFile<T>(filename: string, item: T): boolean {
  const data = readJsonFile<T>(filename);
  data.push(item);
  return writeJsonFile(filename, data);
}

export function findInJsonFile<T>(filename: string, predicate: (item: T) => boolean): T | undefined {
  const data = readJsonFile<T>(filename);
  return data.find(predicate);
}

export function findIndexInJsonFile<T>(filename: string, predicate: (item: T) => boolean): number {
  const data = readJsonFile<T>(filename);
  return data.findIndex(predicate);
}

export function updateInJsonFile<T>(filename: string, predicate: (item: T) => boolean, updates: Partial<T>): T | null {
  const data = readJsonFile<T>(filename);
  const index = data.findIndex(predicate);
  if (index === -1) return null;
  
  data[index] = { ...data[index], ...updates };
  writeJsonFile(filename, data);
  return data[index];
}

export function deleteFromJsonFile<T>(filename: string, predicate: (item: T) => boolean): boolean {
  const data = readJsonFile<T>(filename);
  const initialLength = data.length;
  const filtered = data.filter((item) => !predicate(item));
  if (filtered.length === initialLength) return false;
  return writeJsonFile(filename, filtered);
}

export function getAllFromJsonFile<T>(filename: string): T[] {
  return readJsonFile<T>(filename);
}

export function countJsonFile(filename: string): number {
  return readJsonFile(filename).length;
}

export function clearJsonFile(filename: string): boolean {
  return writeJsonFile(filename, []);
}

export const STORAGE_FILES = {
  members: 'members.json',
  membershipPlans: 'membership-plans.json',
  attendanceEvents: 'attendance-events.json',
  visits: 'visits.json',
  trainers: 'trainers.json',
  enquiries: 'enquiries.json',
  announcements: 'announcements.json',
  workoutPlans: 'workout-plans.json',
  auditLogs: 'audit-logs.json',
  settings: 'settings.json',
} as const;

export type StorageFile = keyof typeof STORAGE_FILES;

export function getStorageFilePath(file: StorageFile): string {
  return getDataFilePath(STORAGE_FILES[file]);
}