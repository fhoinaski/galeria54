import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { menuRepository } from "@/lib/menu-repository";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductForm } from "@/components/admin/ProductForm";

export const runtime = "edge";
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = await menuRepository.getMenuItemById(id);
  return { title: item ? `Editar: ${item.name}` : "Produto não encontrado" };
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const [item, categories] = await Promise.all([
    menuRepository.getMenuItemById(id),
    menuRepository.getCategories(),
  ]);

  if (!item) notFound();

  return (
    <div className="space-y-6">
      <AdminHeader
        title={`Editar: ${item.name}`}
        backHref="/admin/products"
      />
      <ProductForm categories={categories} initialData={item} />
    </div>
  );
}
