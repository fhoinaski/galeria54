import { menuRepository } from "@/lib/menu-repository";
import { MenuClient } from "@/components/MenuClient";

export const revalidate = 60;

export default async function Home() {
  const { categories, items } = await menuRepository.getMenuData();
  return <MenuClient categories={categories} items={items} />;
}
