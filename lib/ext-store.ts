import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import type {
  BusinessSettings,
  RestaurantTable,
  Session,
  SessionItem,
  Event as AppEvent,
  Feedback,
} from "@/types/business";

export type ExtStore = {
  business: BusinessSettings;
  tables: RestaurantTable[];
  sessions: Session[];
  sessionItems: SessionItem[];
  events: AppEvent[];
  feedbacks: Feedback[];
};

function getStorePath() {
  return path.join(process.cwd(), "data", ".local-ext.json");
}

const g = globalThis as unknown as { _caffe54Ext: ExtStore | null };
if (!g._caffe54Ext) g._caffe54Ext = null;

const defaults: ExtStore = {
  business: {
    id: "main",
    name: "Caffè 54",
    description: "",
    currency: "BRL",
    timezone: "America/Sao_Paulo",
    openingHours: {},
    isOpen: true,
    updatedAt: new Date().toISOString(),
  },
  tables: [],
  sessions: [],
  sessionItems: [],
  events: [],
  feedbacks: [],
};

export async function readExtStore(): Promise<ExtStore> {
  if (g._caffe54Ext) return g._caffe54Ext;
  try {
    const content = await readFile(getStorePath(), "utf-8");
    const parsed = JSON.parse(content) as Partial<ExtStore>;
    g._caffe54Ext = { ...defaults, ...parsed };
    return g._caffe54Ext;
  } catch {
    const store = { ...defaults };
    await writeExtStore(store);
    return store;
  }
}

export async function writeExtStore(data: ExtStore): Promise<void> {
  g._caffe54Ext = data;
  try {
    const p = getStorePath();
    await mkdir(path.dirname(p), { recursive: true });
    await writeFile(p, JSON.stringify(data, null, 2), "utf-8");
  } catch { /* silent — in-memory cache still updated */ }
}
