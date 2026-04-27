-- Caffè 54 Menu — Cloudflare D1 schema
-- Apply:
--   wrangler d1 execute caffe54-menu-db --file=database/schema.sql --remote
-- Reset (dev):
--   wrangler d1 execute caffe54-menu-db --file=database/schema.sql --local

CREATE TABLE IF NOT EXISTS categories (
  id            TEXT     PRIMARY KEY,
  slug          TEXT     NOT NULL UNIQUE,
  name_pt       TEXT     NOT NULL,
  name_en       TEXT     NOT NULL,
  name_es       TEXT     NOT NULL,
  image_url     TEXT,
  display_order INTEGER  NOT NULL DEFAULT 0,
  active        INTEGER  NOT NULL DEFAULT 1,   -- 0 | 1
  created_at    TEXT     NOT NULL,
  updated_at    TEXT     NOT NULL
);

CREATE TABLE IF NOT EXISTS menu_items (
  id             TEXT     PRIMARY KEY,
  category_id    TEXT     NOT NULL,
  name           TEXT     NOT NULL,
  description_pt TEXT     NOT NULL,
  description_en TEXT     NOT NULL DEFAULT '',
  description_es TEXT     NOT NULL DEFAULT '',
  price          INTEGER  NOT NULL,             -- centavos (e.g. 4600 = R$ 46,00)
  image_url      TEXT,
  badge_pt       TEXT,
  badge_en       TEXT,
  badge_es       TEXT,
  featured       INTEGER  NOT NULL DEFAULT 0,   -- 0 | 1
  available      INTEGER  NOT NULL DEFAULT 1,   -- 0 | 1
  display_order  INTEGER  NOT NULL DEFAULT 0,
  tags           TEXT     NOT NULL DEFAULT '[]',       -- JSON array
  allergens      TEXT     NOT NULL DEFAULT '[]',       -- JSON array
  pairings       TEXT     NOT NULL DEFAULT '[]',       -- JSON array of item IDs
  created_at     TEXT     NOT NULL,
  updated_at     TEXT     NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_categories_active_order
  ON categories(active, display_order);

CREATE INDEX IF NOT EXISTS idx_items_category_order
  ON menu_items(category_id, display_order);

CREATE INDEX IF NOT EXISTS idx_items_available
  ON menu_items(available);

CREATE INDEX IF NOT EXISTS idx_items_featured
  ON menu_items(featured);

CREATE INDEX IF NOT EXISTS idx_items_updated
  ON menu_items(updated_at);

-- ─── Business settings (single row) ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS business_settings (
  id            TEXT     PRIMARY KEY DEFAULT 'main',
  name          TEXT     NOT NULL DEFAULT 'Caffè 54',
  description   TEXT     NOT NULL DEFAULT '',
  logo_url      TEXT,
  phone         TEXT,
  address       TEXT,
  email         TEXT,
  website       TEXT,
  instagram     TEXT,
  facebook      TEXT,
  opening_hours TEXT     NOT NULL DEFAULT '{}',  -- JSON
  currency      TEXT     NOT NULL DEFAULT 'BRL',
  timezone      TEXT     NOT NULL DEFAULT 'America/Sao_Paulo',
  is_open       INTEGER  NOT NULL DEFAULT 1,
  updated_at    TEXT     NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO business_settings (id) VALUES ('main');

-- ─── Tables ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS restaurant_tables (
  id         TEXT     PRIMARY KEY,
  number     INTEGER  NOT NULL,
  label      TEXT     NOT NULL,
  capacity   INTEGER  NOT NULL DEFAULT 4,
  status     TEXT     NOT NULL DEFAULT 'available',
  qr_url     TEXT     NOT NULL DEFAULT '',
  notes      TEXT,
  created_at TEXT     NOT NULL,
  updated_at TEXT     NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tables_status ON restaurant_tables(status);
CREATE INDEX IF NOT EXISTS idx_tables_number ON restaurant_tables(number);

-- ─── Sessions ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS sessions (
  id           TEXT     PRIMARY KEY,
  table_id     TEXT,
  status       TEXT     NOT NULL DEFAULT 'active',
  total_amount INTEGER  NOT NULL DEFAULT 0,
  notes        TEXT,
  opened_at    TEXT     NOT NULL,
  closed_at    TEXT,
  created_at   TEXT     NOT NULL,
  FOREIGN KEY (table_id) REFERENCES restaurant_tables(id)
);

CREATE INDEX IF NOT EXISTS idx_sessions_table   ON sessions(table_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status  ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_opened  ON sessions(opened_at);

CREATE TABLE IF NOT EXISTS session_items (
  id             TEXT     PRIMARY KEY,
  session_id     TEXT     NOT NULL,
  menu_item_id   TEXT     NOT NULL,
  quantity       INTEGER  NOT NULL DEFAULT 1,
  unit_price     INTEGER  NOT NULL,
  notes          TEXT,
  created_at     TEXT     NOT NULL,
  FOREIGN KEY (session_id)   REFERENCES sessions(id),
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

CREATE INDEX IF NOT EXISTS idx_session_items_session ON session_items(session_id);
CREATE INDEX IF NOT EXISTS idx_session_items_item    ON session_items(menu_item_id);

-- ─── Events ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS events (
  id                  TEXT     PRIMARY KEY,
  title               TEXT     NOT NULL,
  description         TEXT,
  image_url           TEXT,
  start_date          TEXT     NOT NULL,
  end_date            TEXT     NOT NULL,
  active              INTEGER  NOT NULL DEFAULT 1,
  discount_percentage INTEGER,
  category_ids        TEXT     NOT NULL DEFAULT '[]',  -- JSON array
  created_at          TEXT     NOT NULL,
  updated_at          TEXT     NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_dates  ON events(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_events_active ON events(active);

-- ─── Feedbacks ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS feedbacks (
  id             TEXT     PRIMARY KEY,
  session_id     TEXT,
  table_id       TEXT,
  rating         INTEGER  NOT NULL CHECK(rating BETWEEN 1 AND 5),
  comment        TEXT,
  menu_item_id   TEXT,
  created_at     TEXT     NOT NULL,
  FOREIGN KEY (session_id)   REFERENCES sessions(id),
  FOREIGN KEY (table_id)     REFERENCES restaurant_tables(id),
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

CREATE INDEX IF NOT EXISTS idx_feedbacks_session ON feedbacks(session_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_rating  ON feedbacks(rating);
CREATE INDEX IF NOT EXISTS idx_feedbacks_created ON feedbacks(created_at);
