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
        featured: true,
        available: true,
        allergens: ["Glúten", "Lactose", "Soja"]
      }
    ]
  },
  {
    id: "breakfast",
    name: { pt: "Breakfast", en: "Breakfast", es: "Desayuno" },
    items: [
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
        featured: true,
        available: true,
        tags: ["Vegetariano", "Proteico"]
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
    id: "quentes",
    name: { pt: "Caffès Quentes", en: "Hot Coffees", es: "Cafés Calientes" },
    description: { pt: "Grãos especiais da casa", en: "House specialty beans", es: "Granos de especialidad de la casa" },
    items: [
      {
        id: "c-espresso",
        categoryId: "quentes",
        name: { pt: "Espresso 54", en: "Espresso 54", es: "Espresso 54" },
        description: { 
          pt: "Blend exclusivo da casa. Notas de chocolate amargo, caramelo e acidez cítrica média.", 
          en: "Exclusive house blend. Notes of dark chocolate, caramel, and medium citric acidity.", 
          es: "Mezcla exclusiva de la casa. Notas de chocolate amargo, caramelo y acidez cítrica media."
        },
        price: 8.50,
        currency: "BRL",
        available: true,
      },
      {
        id: "c-cappuccino",
        categoryId: "quentes",
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
      }
    ]
  },
  {
    id: "gelados",
    name: { pt: "Caffès Gelados", en: "Iced Coffees", es: "Cafés Helados" },
    items: [
      {
        id: "c-iced-latte",
        categoryId: "gelados",
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
        id: "c-cold-brew",
        categoryId: "gelados",
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
    id: "doces",
    name: { pt: "Doces", en: "Sweets", es: "Dulces" },
    items: [
      {
        id: "d-tiramisu",
        categoryId: "doces",
        name: { pt: "Tiramisù Clássico", en: "Classic Tiramisu", es: "Tiramisú Clásico" },
        description: { 
          pt: "Creme de mascarpone autêntico, biscoito savoardi molhado no nosso Espresso 54 e cacau em pó.", 
          en: "Authentic mascarpone cream, savoardi biscuits soaked in our Espresso 54, and cocoa powder.", 
          es: "Auténtica crema de mascarpone, galletas savoardi bañadas en nuestro Espresso 54 y cacao en polvo."
        },
        price: 28.00,
        currency: "BRL",
        image: "https://picsum.photos/seed/tiramisu/400/300",
        available: true,
        allergens: ["Lactose", "Glúten", "Ovos"],
        pairings: ["c-espresso"]
      }
    ]
  }
];

// Helper to flatten items for search / recommendations
export const allMenuItems = menuData.flatMap(category => category.items);
