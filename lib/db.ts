/**
 * Local mock database using a JSON file for persistence.
 * Switch to Cloudflare D1 by changing DATABASE_PROVIDER=d1 and implementing
 * the D1 adapter below.
 */

import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import type { Category, MenuItem } from "@/types/menu";
import { seedCategories, seedItems } from "@/data/seed-menu";
import { env } from "./env";

export type LocalDB = {
  categories: Category[];
  items: MenuItem[];
  meta: { updatedAt: string };
};

const DB_PATH = path.join(process.cwd(), "data", ".local-db.json");

// Module-level cache shared within the same Node.js process
// (globalThis trick prevents cache loss on Next.js HMR)
const g = globalThis as unknown as { _caffe54Db: LocalDB | null };
if (!g._caffe54Db) g._caffe54Db = null;

// ─── Local provider ───────────────────────────────────────────────────────────

async function readLocalDB(): Promise<LocalDB> {
  if (g._caffe54Db) return g._caffe54Db;
  try {
    const content = await readFile(DB_PATH, "utf-8");
    g._caffe54Db = JSON.parse(content) as LocalDB;
    return g._caffe54Db;
  } catch {
    const initial: LocalDB = {
      categories: seedCategories,
      items: seedItems,
      meta: { updatedAt: new Date().toISOString() },
    };
    await writeLocalDB(initial);
    return initial;
  }
}

async function writeLocalDB(data: LocalDB): Promise<void> {
  data.meta.updatedAt = new Date().toISOString();
  g._caffe54Db = data;
  try {
    await mkdir(path.dirname(DB_PATH), { recursive: true });
    await writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // Silent fail — module cache is still updated
  }
}

// ─── D1 provider stub ─────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type D1Binding = any;

async function queryD1(_binding: D1Binding): Promise<LocalDB> {
  throw new Error(
    "D1 provider not yet implemented. Set DATABASE_PROVIDER=local for development."
  );
}

// ─── Public interface ─────────────────────────────────────────────────────────

export const db = {
  async read(): Promise<LocalDB> {
    if (env.databaseProvider === "d1") return queryD1(null);
    return readLocalDB();
  },

  async write(data: LocalDB): Promise<void> {
    if (env.databaseProvider === "d1") {
      throw new Error("D1 writes not yet implemented.");
    }
    await writeLocalDB(data);
  },

  /** Invalidate the in-memory cache (used after external writes) */
  invalidate(): void {
    g._caffe54Db = null;
  },
};
