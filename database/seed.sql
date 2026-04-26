-- Caffè 54 Menu — Initial seed data
-- Apply AFTER schema.sql:
--   wrangler d1 execute caffe54-menu-db --file=database/seed.sql --remote
-- Local dev:
--   wrangler d1 execute caffe54-menu-db --file=database/seed.sql --local
--
-- Prices are in centavos: 4600 = R$ 46,00

-- ─── Categories ───────────────────────────────────────────────────────────────

INSERT OR IGNORE INTO categories (id, slug, name_pt, name_en, name_es, display_order, active, created_at, updated_at)
VALUES
  ('vitrine',       'vitrine',       'Vitrine',       'Showcase',     'Vitrina',            0, 1, '2025-01-01T00:00:00.000Z', '2025-01-01T00:00:00.000Z'),
  ('breakfast',     'breakfast',     'Breakfast',     'Breakfast',    'Desayuno',           1, 1, '2025-01-01T00:00:00.000Z', '2025-01-01T00:00:00.000Z'),
  ('sanduiches',    'sanduiches',    'Sanduíches',    'Sandwiches',   'Sándwiches',         2, 1, '2025-01-01T00:00:00.000Z', '2025-01-01T00:00:00.000Z'),
  ('doces',         'doces',         'Doces',         'Sweets',       'Dulces',             3, 1, '2025-01-01T00:00:00.000Z', '2025-01-01T00:00:00.000Z'),
  ('cafes-quentes', 'cafes-quentes', 'Cafés Quentes', 'Hot Coffees',  'Cafés Calientes',   4, 1, '2025-01-01T00:00:00.000Z', '2025-01-01T00:00:00.000Z'),
  ('cafes-gelados', 'cafes-gelados', 'Cafés Gelados', 'Iced Coffees', 'Cafés Helados',     5, 1, '2025-01-01T00:00:00.000Z', '2025-01-01T00:00:00.000Z'),
  ('drinks',        'drinks',        'Drinks',        'Drinks',       'Bebidas Especiales', 6, 1, '2025-01-01T00:00:00.000Z', '2025-01-01T00:00:00.000Z'),
  ('bebidas',       'bebidas',       'Bebidas',       'Beverages',    'Bebidas',            7, 1, '2025-01-01T00:00:00.000Z', '2025-01-01T00:00:00.000Z');

-- ─── Menu items ───────────────────────────────────────────────────────────────

-- Vitrine
INSERT OR IGNORE INTO menu_items
  (id, category_id, name, description_pt, description_en, description_es, price, image_url, featured, available, display_order, tags, allergens, pairings, created_at, updated_at)
VALUES
  (
    'c-croissant', 'vitrine', 'Croissant Tradicional',
    'Massa folhada amanteigada, assada diariamente na nossa confeitaria.',
    'Buttery puff pastry, baked daily in our bakery.',
    'Hojaldre de mantequilla, horneado diariamente en nuestra pastelería.',
    1400, 'https://picsum.photos/seed/croissant/400/300',
    0, 1, 0, '["Vegetariano"]', '["Glúten","Lactose"]', '["c-espresso","c-cappuccino"]',
    '2025-01-01T00:00:00.000Z', '2025-01-01T00:00:00.000Z'
  ),
  (
    'c-pain-au-chocolat', 'vitrine', 'Pain au Chocolat',
    'Clássico francês com duas barras de chocolate amargo intenso.',
    'French classic with two bars of intense dark chocolate.',
    'Clásico francés con dos barras de chocolate negro intenso.',
    1800, 'https://picsum.photos/seed/painauchoc/400/300',
    1, 1, 1, '[]', '["Glúten","Lactose","Soja"]', '[]',
    '2025-01-01T00:00:00.000Z', '2025-01-01T00:00:00.000Z'
  );

-- Vitrine badges
UPDATE menu_items SET badge_pt='Especial', badge_en='Special', badge_es='Especial' WHERE id='c-pain-au-chocolat';

-- Breakfast
INSERT OR IGNORE INTO menu_items
  (id, category_id, name, description_pt, description_en, description_es, price, image_url, featured, available, display_order, tags, allergens, pairings, created_at, updated_at)
VALUES
  (
    'colazione-del-mattino', 'breakfast', 'Colazione Del Mattino',
    'Ovos fritos, bacon, creme de abacate, toast e manteiga da casa.',
    'Fried eggs, bacon, avocado cream, toast and house butter.',
    'Huevos fritos, tocino, crema de aguacate, tostada y mantequilla de la casa.',
    4600, 'https://picsum.photos/seed/colazione/400/300',
    1, 1, 0, '["Proteico"]', '["Glúten","Ovos","Lactose"]', '["latte-vaniglia","c-espresso"]',
    '2025-01-01T00:00:00.000Z', '2025-01-01T00:00:00.000Z'
  ),
  (
    'classico', 'breakfast', 'Classico',
    'Ovos mexidos e toast.',
    'Scrambled eggs and toast.',
    'Huevos revueltos y tostada.',
    3200, 'https://picsum.photos/seed/classico/400/300',
    0, 1, 1, '[]', '["Glúten","Ovos"]', '[]',
    '2025-01-01T00:00:00.000Z', '2025-01-01T00:00:00.000Z'
  ),
  (
    'b-avocado-toast', 'breakfast', 'Avocado Toast',
    'Pão de fermentação natural, creme de abacate temperado, ovo poché e fios de azeite.',
    'Sourdough bread, seasoned avocado cream, poached egg, and a drizzle of olive oil.',
    'Pan de masa madre, crema de aguacate condimentada, huevo escalfado y aceite de oliva.',
    3200, 'https://picsum.photos/seed/avocado/400/300',
    0, 1, 2, '["Vegetariano","Proteico"]', '["Glúten","Ovos"]', '[]',
    '2025-01-01T00:00:00.000Z', '2025-01-01T00:00:00.000Z'
  ),
  (
    'b-pao-na-chapa', 'breakfast', 'Pão na Chapa Premium',
    'Pão de queijo da Canastra ou pão francês tostado com manteiga Ghee.',
    'Canastra cheese bread or French bread toasted with Ghee butter.',
    'Pan de queso de Canastra o pan francés tostado con mantequilla Ghee.',
    1200, NULL,
    0, 1, 3, '[]', '["Glúten","Lactose"]', '[]',
    '2025-01-01T00:00:00.000Z', '2025-01-01T00:00:00.000Z'
  );

UPDATE menu_items SET badge_pt='Especial da casa', badge_en='House Special', badge_es='Especial de la casa'
  WHERE id='colazione-del-mattino';

-- Sanduíches
INSERT OR IGNORE INTO menu_items
  (id, category_id, name, description_pt, description_en, description_es, price, image_url, featured, available, display_order, tags, allergens, pairings, created_at, updated_at)
VALUES
  (
    'waffle-salmone', 'sanduiches', 'Waffle Salmone',
    'Waffle, abacate, salmão defumado e sour cream.',
    'Waffle, avocado, smoked salmon and sour cream.',
    'Waffle, aguacate, salmón ahumado y crema agria.',
    5500, 'https://picsum.photos/seed/wafflesalmone/400/300',
    0, 1, 0, '[]', '["Glúten","Lactose","Peixes"]', '[]',
    '2025-01-01T00:00:00.000Z', '2025-01-01T00:00:00.000Z'
  );

UPDATE menu_items SET badge_pt='Premium', badge_en='Premium', badge_es='Premium' WHERE id='waffle-salmone';

-- Doces
INSERT OR IGNORE INTO menu_items
  (id, category_id, name, description_pt, description_en, description_es, price, image_url, featured, available, display_order, tags, allergens, pairings, created_at, updated_at)
VALUES
  (
    'toast-pistacchio', 'doces', 'Toast Pistacchio',
    'Pão de fermentação natural, creme de ricota e creme praliné de pistache.',
    'Sourdough bread, ricotta cream and pistachio praline cream.',
    'Pan de masa madre, crema de ricota y crema praliné de pistacho.',
    2600, 'https://picsum.photos/seed/toastpistacchio/400/300',
    0, 1, 0, '[]', '["Glúten","Lactose","Frutos secos"]', '["c-espresso","latte-vaniglia"]',
    '2025-01-01T00:00:00.000Z', '2025-01-01T00:00:00.000Z'
  ),
  (
    'tiramisu', 'doces', 'Tiramisu',
    'Savoiardi, espresso da casa, creme de mascarpone e cacau.',
    'Savoiardi biscuits, house espresso, mascarpone cream and cocoa.',
    'Savoiardi, espresso de la casa, crema de mascarpone y cacao.',
    2400, 'https://picsum.photos/seed/tiramisu/400/300',
    1, 1, 1, '[]', '["Lactose","Glúten","Ovos"]', '["c-espresso"]',
    '2025-01-01T00:00:00.000Z', '2025-01-01T00:00:00.000Z'
  ),
  (
    'frutta-fresca', 'doces', 'Frutta Fresca',
    'Frutas do dia, creme de iogurte, granola e mel silvestre.',
    'Daily fruits, yogurt cream, granola and wild honey.',
    'Frutas del día, crema de yogur, granola y miel silvestre.',
    2500, 'https://picsum.photos/seed/fruttafresca/400/300',
    0, 1, 2, '["Vegetariano"]', '["Lactose"]', '[]',
    '2025-01-01T00:00:00.000Z', '2025-01-01T00:00:00.000Z'
  );

UPDATE menu_items SET badge_pt='Combina com café', badge_en='Goes with coffee', badge_es='Combina con café' WHERE id='toast-pistacchio';
UPDATE menu_items SET badge_pt='Mais pedido',      badge_en='Most ordered',     badge_es='Más pedido'      WHERE id='tiramisu';
UPDATE menu_items SET badge_pt='Leve',             badge_en='Light',            badge_es='Ligero'          WHERE id='frutta-fresca';

-- Cafés Quentes
INSERT OR IGNORE INTO menu_items
  (id, category_id, name, description_pt, description_en, description_es, price, image_url, featured, available, display_order, tags, allergens, pairings, created_at, updated_at)
VALUES
  (
    'c-espresso', 'cafes-quentes', 'Espresso 54',
    'Blend exclusivo da casa. Notas de chocolate amargo, caramelo e acidez cítrica média.',
    'Exclusive house blend. Notes of dark chocolate, caramel, and medium citric acidity.',
    'Mezcla exclusiva. Notas de chocolate amargo, caramelo y acidez cítrica media.',
    850, 'https://picsum.photos/seed/espresso54/400/300',
    0, 1, 0, '[]', '[]', '[]',
    '2025-01-01T00:00:00.000Z', '2025-01-01T00:00:00.000Z'
  ),
  (
    'c-cappuccino', 'cafes-quentes', 'Cappuccino Italiano',
    'Espresso duplo, leite vaporizado e crema espessa. (Opção s/ lactose disponível)',
    'Double espresso, steamed milk, and thick crema. (Lactose-free option available)',
    'Espresso doble, leche al vapor y crema espesa. (Opción sin lactosa disponible)',
    1600, 'https://picsum.photos/seed/cappuccino/400/300',
    0, 1, 1, '[]', '["Lactose"]', '[]',
    '2025-01-01T00:00:00.000Z', '2025-01-01T00:00:00.000Z'
  ),
  (
    'latte-vaniglia', 'cafes-quentes', 'Latte Vaniglia',
    'Leite vaporizado, baunilha artesanal e espresso.',
    'Steamed milk, artisanal vanilla and espresso.',
    'Leche vaporizada, vainilla artesanal y espresso.',
    2200, 'https://picsum.photos/seed/lattevaniglia/400/300',
    1, 1, 2, '[]', '["Lactose"]', '[]',
    '2025-01-01T00:00:00.000Z', '2025-01-01T00:00:00.000Z'
  );

UPDATE menu_items SET badge_pt='Especial', badge_en='Special', badge_es='Especial' WHERE id='latte-vaniglia';

-- Cafés Gelados
INSERT OR IGNORE INTO menu_items
  (id, category_id, name, description_pt, description_en, description_es, price, image_url, featured, available, display_order, tags, allergens, pairings, created_at, updated_at)
VALUES
  (
    'c-iced-latte', 'cafes-gelados', 'Iced Caramel Latte',
    'Espresso sobre gelo, leite gelado e xarope artesanal de caramelo salgado.',
    'Espresso over ice, cold milk, and artisanal salted caramel syrup.',
    'Espresso sobre hielo, leche fría y sirope artesanal de caramelo salado.',
    2200, 'https://picsum.photos/seed/icedlatte/400/300',
    1, 1, 0, '[]', '["Lactose"]', '[]',
    '2025-01-01T00:00:00.000Z', '2025-01-01T00:00:00.000Z'
  ),
  (
    'orange-espresso', 'cafes-gelados', 'Orange Espresso',
    'Suco de laranja, espresso e gelo.',
    'Orange juice, espresso and ice.',
    'Jugo de naranja, espresso y hielo.',
    2400, 'https://picsum.photos/seed/orangeespresso/400/300',
    0, 1, 1, '[]', '[]', '[]',
    '2025-01-01T00:00:00.000Z', '2025-01-01T00:00:00.000Z'
  ),
  (
    'c-cold-brew', 'cafes-gelados', 'Cold Brew',
    'Extração a frio por 18 horas para um café refrescante, doce e sem amargor.',
    'Cold extraction for 18 hours for a refreshing, sweet, and non-bitter coffee.',
    'Extracción en frío durante 18 horas para un café refrescante, dulce y sin amargor.',
    1800, NULL,
    0, 0, 2, '[]', '[]', '[]',
    '2025-01-01T00:00:00.000Z', '2025-01-01T00:00:00.000Z'
  );

UPDATE menu_items SET badge_pt='Refrescante', badge_en='Refreshing', badge_es='Refrescante' WHERE id='orange-espresso';

-- Drinks
INSERT OR IGNORE INTO menu_items
  (id, category_id, name, description_pt, description_en, description_es, price, image_url, featured, available, display_order, tags, allergens, pairings, created_at, updated_at)
VALUES
  (
    'espresso-martini', 'drinks', 'Espresso Martini',
    'Vodka, espresso e licor de café.',
    'Vodka, espresso and coffee liqueur.',
    'Vodka, espresso y licor de café.',
    4200, 'https://picsum.photos/seed/espressomartini/400/300',
    0, 1, 0, '[]', '["Álcool"]', '[]',
    '2025-01-01T00:00:00.000Z', '2025-01-01T00:00:00.000Z'
  );

-- Bebidas
INSERT OR IGNORE INTO menu_items
  (id, category_id, name, description_pt, description_en, description_es, price, image_url, featured, available, display_order, tags, allergens, pairings, created_at, updated_at)
VALUES
  (
    'suco-laranja', 'bebidas', 'Suco de Laranja Natural',
    'Laranjas frescas espremidas na hora.',
    'Fresh oranges squeezed to order.',
    'Naranjas frescas exprimidas al momento.',
    1400, 'https://picsum.photos/seed/sucolaranja/400/300',
    0, 1, 0, '["Vegano","Sem glúten"]', '[]', '[]',
    '2025-01-01T00:00:00.000Z', '2025-01-01T00:00:00.000Z'
  );
