import { MenuCategory } from "@/types/menu";

export const menuData: MenuCategory[] = [
  {
    id: "vitrine",
    name: { pt: "Vitrine", en: "Showcase", es: "Vitrina" },
    description: { pt: "Frescos e feitos hoje", en: "Fresh and made today", es: "Frescos y hechos de hoy" },
    items: [
      {
        id: "c-croissant",
        categoryId: "vitrine",
        name: { pt: "Croissant Tradicional", en: "Traditional Croissant", es: "Croissant Tradicional" },
        description: {
          pt: "Massa folhada amanteigada, assada diariamente na nossa confeitaria.",
          en: "Buttery puff pastry, baked daily in our bakery.",
          es: "Hojaldre de mantequilla, horneado diariamente en nuestra pastelería."
        },
        price: 14.00,
        currency: "BRL",
        image: "https://picsum.photos/seed/croissant/400/300",
        tags: ["Vegetariano"],
        available: true,
        allergens: ["Glúten", "Lactose"],
        pairings: ["c-espresso", "c-cappuccino"]
      },
      {
        id: "c-pain-au-chocolat",
        categoryId: "vitrine",
        name: { pt: "Pain au Chocolat", en: "Pain au Chocolat", es: "Pain au Chocolat" },
        description: {
          pt: "Clássico francês com duas barras de chocolate amargo intenso.",
          en: "French classic with two bars of intense dark chocolate.",
          es: "Clásico francés con dos barras de chocolate negro intenso."
        },
        price: 18.00,
        currency: "BRL",
        image: "https://picsum.photos/seed/painauchoc/400/300",
        badge: "Especial",
        featured: true,
        available: true,
        allergens: ["Glúten", "Lactose", "Soja"]
      }
    ]
  },
  {
    id: "breakfast",
    name: { pt: "Breakfast", en: "Breakfast", es: "Desayuno" },
    description: { pt: "Da manhã ao meio-dia", en: "Morning to noon", es: "Mañana al mediodía" },
    items: [
      {
        id: "colazione-del-mattino",
        categoryId: "breakfast",
        name: { pt: "Colazione Del Mattino", en: "Colazione Del Mattino", es: "Colazione Del Mattino" },
        description: {
          pt: "Ovos fritos, bacon, creme de abacate, toast e manteiga da casa.",
          en: "Fried eggs, bacon, avocado cream, toast and house butter.",
          es: "Huevos fritos, tocino, crema de aguacate, tostada y mantequilla de la casa."
        },
        price: 46.00,
        currency: "BRL",
        image: "https://picsum.photos/seed/colazione/400/300",
        badge: "Especial da casa",
        featured: true,
        available: true,
        tags: ["Proteico"],
        allergens: ["Glúten", "Ovos", "Lactose"],
        pairings: ["latte-vaniglia", "c-espresso"]
      },
      {
        id: "classico",
        categoryId: "breakfast",
        name: { pt: "Classico", en: "Classico", es: "Clásico" },
        description: {
          pt: "Ovos mexidos e toast.",
          en: "Scrambled eggs and toast.",
          es: "Huevos revueltos y tostada."
        },
        price: 32.00,
        currency: "BRL",
        image: "https://picsum.photos/seed/classico/400/300",
        available: true,
        allergens: ["Glúten", "Ovos"]
      },
      {
        id: "b-avocado-toast",
        categoryId: "breakfast",
        name: { pt: "Avocado Toast", en: "Avocado Toast", es: "Tostada de Aguacate" },
        description: {
          pt: "Pão de fermentação natural, creme de abacate temperado, ovo poché e fios de azeite.",
          en: "Sourdough bread, seasoned avocado cream, poached egg, and a drizzle of olive oil.",
          es: "Pan de masa madre, crema de aguacate condimentada, huevo escalfado y un chorrito de aceite de oliva."
        },
        price: 32.00,
        currency: "BRL",
        image: "https://picsum.photos/seed/avocado/400/300",
        available: true,
        tags: ["Vegetariano", "Proteico"],
        allergens: ["Glúten", "Ovos"]
      },
      {
        id: "b-pao-na-chapa",
        categoryId: "breakfast",
        name: { pt: "Pão na Chapa Premium", en: "Premium Grilled Bread", es: "Pan a la Plancha Premium" },
        description: {
          pt: "Pão de queijo da Canastra ou pão francês tostado com manteiga Ghee.",
          en: "Canastra cheese bread or French bread toasted with Ghee butter.",
          es: "Pan de queso de Canastra o pan francés tostado con mantequilla Ghee."
        },
        price: 12.00,
        currency: "BRL",
        available: true,
      }
    ]
  },
  {
    id: "sanduiches",
    name: { pt: "Sanduíches", en: "Sandwiches", es: "Sándwiches" },
    description: { pt: "Combos para qualquer hora", en: "Combos for any time", es: "Combos para cualquier hora" },
    items: [
      {
        id: "waffle-salmone",
        categoryId: "sanduiches",
        name: { pt: "Waffle Salmone", en: "Waffle Salmone", es: "Waffle Salmone" },
        description: {
          pt: "Waffle, abacate, salmão defumado e sour cream.",
          en: "Waffle, avocado, smoked salmon and sour cream.",
          es: "Waffle, aguacate, salmón ahumado y crema agria."
        },
        price: 55.00,
        currency: "BRL",
        image: "https://picsum.photos/seed/wafflesalmone/400/300",
        badge: "Premium",
        available: true,
        allergens: ["Glúten", "Lactose", "Peixes"]
      }
    ]
  },
  {
    id: "doces",
    name: { pt: "Doces", en: "Sweets", es: "Dulces" },
    description: { pt: "Para adoçar o momento", en: "To sweeten the moment", es: "Para endulzar el momento" },
    items: [
      {
        id: "toast-pistacchio",
        categoryId: "doces",
        name: { pt: "Toast Pistacchio", en: "Toast Pistacchio", es: "Toast Pistacchio" },
        description: {
          pt: "Pão de fermentação natural, creme de ricota e creme praliné de pistache.",
          en: "Sourdough bread, ricotta cream and pistachio praline cream.",
          es: "Pan de masa madre, crema de ricota y crema praliné de pistacho."
        },
        price: 26.00,
        currency: "BRL",
        image: "https://picsum.photos/seed/toastpistacchio/400/300",
        badge: "Combina com café",
        available: true,
        allergens: ["Glúten", "Lactose", "Frutos secos"],
        pairings: ["c-espresso", "latte-vaniglia"]
      },
      {
        id: "tiramisu",
        categoryId: "doces",
        name: { pt: "Tiramisu", en: "Tiramisu", es: "Tiramisú" },
        description: {
          pt: "Savoiardi, espresso da casa, creme de mascarpone e cacau.",
          en: "Savoiardi biscuits, house espresso, mascarpone cream and cocoa.",
          es: "Savoiardi, espresso de la casa, crema de mascarpone y cacao."
        },
        price: 24.00,
        currency: "BRL",
        image: "https://picsum.photos/seed/tiramisu/400/300",
        badge: "Mais pedido",
        featured: true,
        available: true,
        allergens: ["Lactose", "Glúten", "Ovos"],
        pairings: ["c-espresso", "c-cappuccino"]
      },
      {
        id: "frutta-fresca",
        categoryId: "doces",
        name: { pt: "Frutta Fresca", en: "Frutta Fresca", es: "Frutta Fresca" },
        description: {
          pt: "Frutas do dia, creme de iogurte, granola e mel silvestre.",
          en: "Daily fruits, yogurt cream, granola and wild honey.",
          es: "Frutas del día, crema de yogur, granola y miel silvestre."
        },
        price: 25.00,
        currency: "BRL",
        image: "https://picsum.photos/seed/fruttafresca/400/300",
        badge: "Leve",
        available: true,
        tags: ["Vegetariano"],
        allergens: ["Lactose"]
      }
    ]
  },
  {
    id: "cafes-quentes",
    name: { pt: "Cafés Quentes", en: "Hot Coffees", es: "Cafés Calientes" },
    description: { pt: "Grãos especiais da casa", en: "House specialty beans", es: "Granos de especialidad de la casa" },
    items: [
      {
        id: "c-espresso",
        categoryId: "cafes-quentes",
        name: { pt: "Espresso 54", en: "Espresso 54", es: "Espresso 54" },
        description: {
          pt: "Blend exclusivo da casa. Notas de chocolate amargo, caramelo e acidez cítrica média.",
          en: "Exclusive house blend. Notes of dark chocolate, caramel, and medium citric acidity.",
          es: "Mezcla exclusiva de la casa. Notas de chocolate amargo, caramelo y acidez cítrica media."
        },
        price: 8.50,
        currency: "BRL",
        image: "https://picsum.photos/seed/espresso54/400/300",
        available: true,
      },
      {
        id: "c-cappuccino",
        categoryId: "cafes-quentes",
        name: { pt: "Cappuccino Italiano", en: "Italian Cappuccino", es: "Cappuccino Italiano" },
        description: {
          pt: "Espresso duplo, leite vaporizado e crema espessa. (Opção s/ lactose disponível)",
          en: "Double espresso, steamed milk, and thick crema. (Lactose-free option available)",
          es: "Espresso doble, leche al vapor y crema espesa. (Opción sin lactosa disponible)"
        },
        price: 16.00,
        currency: "BRL",
        image: "https://picsum.photos/seed/cappuccino/400/300",
        available: true,
        allergens: ["Lactose"]
      },
      {
        id: "latte-vaniglia",
        categoryId: "cafes-quentes",
        name: { pt: "Latte Vaniglia", en: "Latte Vaniglia", es: "Latte Vaniglia" },
        description: {
          pt: "Leite vaporizado, baunilha artesanal e espresso.",
          en: "Steamed milk, artisanal vanilla and espresso.",
          es: "Leche vaporizada, vainilla artesanal y espresso."
        },
        price: 22.00,
        currency: "BRL",
        image: "https://picsum.photos/seed/lattevaniglia/400/300",
        badge: "Especial",
        featured: true,
        available: true,
        allergens: ["Lactose"]
      }
    ]
  },
  {
    id: "cafes-gelados",
    name: { pt: "Cafés Gelados", en: "Iced Coffees", es: "Cafés Helados" },
    description: { pt: "Refrescantes e aromáticos", en: "Refreshing and aromatic", es: "Refrescantes y aromáticos" },
    items: [
      {
        id: "c-iced-latte",
        categoryId: "cafes-gelados",
        name: { pt: "Iced Caramel Latte", en: "Iced Caramel Latte", es: "Latte Helado de Caramelo" },
        description: {
          pt: "Espresso sobre gelo, leite gelado e xarope artesanal de caramelo salgado.",
          en: "Espresso over ice, cold milk, and artisanal salted caramel syrup.",
          es: "Espresso sobre hielo, leche fría y sirope artesanal de caramelo salado."
        },
        price: 22.00,
        currency: "BRL",
        image: "https://picsum.photos/seed/icedlatte/400/300",
        featured: true,
        available: true,
        allergens: ["Lactose"]
      },
      {
        id: "orange-espresso",
        categoryId: "cafes-gelados",
        name: { pt: "Orange Espresso", en: "Orange Espresso", es: "Orange Espresso" },
        description: {
          pt: "Suco de laranja, espresso e gelo.",
          en: "Orange juice, espresso and ice.",
          es: "Jugo de naranja, espresso y hielo."
        },
        price: 24.00,
        currency: "BRL",
        image: "https://picsum.photos/seed/orangeespresso/400/300",
        badge: "Refrescante",
        available: true,
      },
      {
        id: "c-cold-brew",
        categoryId: "cafes-gelados",
        name: { pt: "Cold Brew", en: "Cold Brew", es: "Cold Brew" },
        description: {
          pt: "Extração a frio por 18 horas para um café refrescante, doce e sem amargor.",
          en: "Cold extraction for 18 hours for a refreshing, sweet, and non-bitter coffee.",
          es: "Extracción en frío durante 18 horas para un café refrescante, dulce y sin amargor."
        },
        price: 18.00,
        currency: "BRL",
        available: false,
      }
    ]
  },
  {
    id: "drinks",
    name: { pt: "Drinks", en: "Drinks", es: "Bebidas Especiales" },
    description: { pt: "Drinks especiais da casa", en: "Special house drinks", es: "Bebidas especiales de la casa" },
    items: [
      {
        id: "espresso-martini",
        categoryId: "drinks",
        name: { pt: "Espresso Martini", en: "Espresso Martini", es: "Espresso Martini" },
        description: {
          pt: "Vodka, espresso e licor de café.",
          en: "Vodka, espresso and coffee liqueur.",
          es: "Vodka, espresso y licor de café."
        },
        price: 42.00,
        currency: "BRL",
        image: "https://picsum.photos/seed/espressomartini/400/300",
        available: true,
        allergens: ["Álcool"]
      }
    ]
  },
  {
    id: "bebidas",
    name: { pt: "Bebidas", en: "Beverages", es: "Bebidas" },
    description: { pt: "Naturais e refrescantes", en: "Natural and refreshing", es: "Naturales y refrescantes" },
    items: [
      {
        id: "suco-laranja",
        categoryId: "bebidas",
        name: { pt: "Suco de Laranja Natural", en: "Fresh Orange Juice", es: "Jugo de Naranja Natural" },
        description: {
          pt: "Laranjas frescas espremidas na hora.",
          en: "Fresh oranges squeezed to order.",
          es: "Naranjas frescas exprimidas al momento."
        },
        price: 14.00,
        currency: "BRL",
        image: "https://picsum.photos/seed/sucolaranja/400/300",
        available: true,
        tags: ["Vegano", "Sem glúten"]
      }
    ]
  }
];

export const allMenuItems = menuData.flatMap(category => category.items);
