// ─── Business Settings ────────────────────────────────────────────────────────

export type BusinessSettings = {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  phone?: string;
  address?: string;
  email?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  /** JSON: { mon: "08:00-22:00", tue: "08:00-22:00", ... } | null = closed */
  openingHours: Record<string, string | null>;
  /** e.g. "BRL" */
  currency: string;
  /** e.g. "America/Sao_Paulo" */
  timezone: string;
  /** Override open/closed regardless of opening hours */
  isOpen: boolean;
  updatedAt: string;
};

export type UpdateBusinessSettingsInput = Partial<Omit<BusinessSettings, "id" | "updatedAt">>;

// ─── Tables ───────────────────────────────────────────────────────────────────

export type TableStatus = "available" | "occupied" | "reserved" | "inactive";

export type RestaurantTable = {
  id: string;
  number: number;
  label: string;
  capacity: number;
  status: TableStatus;
  /** Full URL to scan — e.g. https://caffe54.com/?table=mesa-01 */
  qrUrl: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateTableInput = Omit<RestaurantTable, "id" | "createdAt" | "updatedAt">;
export type UpdateTableInput = Partial<CreateTableInput>;

// ─── Sessions ─────────────────────────────────────────────────────────────────

export type SessionStatus = "active" | "closed" | "cancelled";

export type Session = {
  id: string;
  tableId: string;
  tableLabel?: string; // joined
  status: SessionStatus;
  /** Total in centavos */
  totalAmount: number;
  notes?: string;
  openedAt: string;
  closedAt?: string;
  createdAt: string;
};

export type SessionItem = {
  id: string;
  sessionId: string;
  menuItemId: string;
  menuItemName?: string; // joined
  quantity: number;
  /** Unit price in centavos at time of order */
  unitPrice: number;
  notes?: string;
  createdAt: string;
};

export type SessionWithItems = Session & { items: SessionItem[] };

export type CreateSessionInput = { tableId: string; notes?: string };
export type AddSessionItemInput = {
  sessionId: string;
  menuItemId: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
};

// ─── Events ───────────────────────────────────────────────────────────────────

export type Event = {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  startDate: string; // ISO date string
  endDate: string;
  active: boolean;
  /** Optional discount percentage 0-100 */
  discountPercentage?: number;
  /** Linked category IDs (JSON array) */
  categoryIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type CreateEventInput = Omit<Event, "id" | "createdAt" | "updatedAt">;
export type UpdateEventInput = Partial<CreateEventInput>;

// ─── Feedbacks ────────────────────────────────────────────────────────────────

export type Feedback = {
  id: string;
  sessionId?: string;
  tableId?: string;
  tableLabel?: string; // joined
  /** Rating 1-5 */
  rating: number;
  comment?: string;
  /** Optional: feedback on a specific item */
  menuItemId?: string;
  menuItemName?: string; // joined
  createdAt: string;
};

export type CreateFeedbackInput = Omit<Feedback, "id" | "tableLabel" | "menuItemName" | "createdAt">;

// ─── Analytics ────────────────────────────────────────────────────────────────

export type DayRevenue = { date: string; revenue: number; sessions: number };
export type PopularItem = { id: string; name: string; quantity: number; revenue: number };
export type HourCount = { hour: number; count: number };
export type RatingSummary = { average: number; total: number; distribution: Record<string, number> };

export type AnalyticsData = {
  revenueByDay: DayRevenue[];
  popularItems: PopularItem[];
  peakHours: HourCount[];
  ratings: RatingSummary;
  totalSessions: number;
  totalRevenue: number;
  avgTicket: number;
  period: { from: string; to: string };
};

// ─── Recommendations ─────────────────────────────────────────────────────────

export type Recommendation = {
  item: import("./menu").MenuItem;
  score: number;
  reason: string;
};
