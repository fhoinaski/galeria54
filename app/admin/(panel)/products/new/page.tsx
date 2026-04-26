import type { Metadata } from "next";
import { menuRepository } from "@/lib/menu-repository";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Novo produto" };

export default async function NewProductPage() {
  const categories = await menuRepository.getCategories();

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Novo produto"
        subtitle="Preencha os dados para adicionar um produto ao cardápio"
        backHref="/admin/products"
      />
      <ProductForm categories={categories} />
    </div>
  );
}
