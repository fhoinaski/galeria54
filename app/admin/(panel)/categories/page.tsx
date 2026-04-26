import type { Metadata } from "next";
import { menuRepository } from "@/lib/menu-repository";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CategoriesClient } from "./CategoriesClient";

export const metadata: Metadata = { title: "Categorias" };

export default async function AdminCategoriesPage() {
  const categories = await menuRepository.getCategories();

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Categorias"
        subtitle={`${categories.length} categoria${categories.length !== 1 ? "s" : ""} cadastrada${categories.length !== 1 ? "s" : ""}`}
      />
      <CategoriesClient initialCategories={categories} />
    </div>
  );
}
