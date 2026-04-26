import type { Metadata } from "next";
import { menuRepository } from "@/lib/menu-repository";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductsClient } from "./ProductsClient";

export const metadata: Metadata = { title: "Produtos" };

export default async function AdminProductsPage() {
  const [items, categories] = await Promise.all([
    menuRepository.getMenuItems(),
    menuRepository.getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <AdminHeader title="Produtos" subtitle={`${items.length} produto${items.length !== 1 ? "s" : ""} no cardápio`} />
      <ProductsClient initialItems={items} categories={categories} />
    </div>
  );
}
