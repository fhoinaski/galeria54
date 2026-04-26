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
