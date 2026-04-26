"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Plus, Edit, Copy, Trash2, ImageOff, Star, ChevronDown } from "lucide-react";
import type { Category, MenuItem } from "@/types/menu";
import { formatCurrency } from "@/lib/currency";
import { AvailabilityToggle } from "./AvailabilityToggle";
import { EmptyState } from "./EmptyState";

interface ProductTableProps {
  items: MenuItem[];
  categories: Category[];
  onToggleAvailable: (id: string, val: boolean) => void;
  onToggleFeatured: (id: string, val: boolean) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ProductTable({
  items, categories, onToggleAvailable, onToggleFeatured, onDuplicate, onDelete,
}: ProductTableProps) {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterAvail, setFilterAvail] = useState("");

  const catMap = useMemo(
    () => new Map(categories.map(c => [c.id, c.name.pt])),
    [categories]
  );

  const filtered = useMemo(() => {
    let result = items;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(i => i.name.toLowerCase().includes(q));
    }
    if (filterCat) result = result.filter(i => i.categoryId === filterCat);
    if (filterAvail === "available") result = result.filter(i => i.available);
    if (filterAvail === "unavailable") result = result.filter(i => !i.available);
    if (filterAvail === "featured") result = result.filter(i => i.featured);
    return result;
  }, [items, search, filterCat, filterAvail]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome..."
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-olive-500/30 focus:border-olive-500"
          />
        </div>

        <div className="flex gap-2">
          <Select value={filterCat} onChange={setFilterCat}>
            <option value="">Todas as categorias</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name.pt}</option>)}
          </Select>

          <Select value={filterAvail} onChange={setFilterAvail}>
            <option value="">Todos os status</option>
            <option value="available">Disponíveis</option>
            <option value="unavailable">Indisponíveis</option>
            <option value="featured">Em destaque</option>
          </Select>

          <Link
            href="/admin/products/new"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-olive-700 text-white text-sm font-medium rounded-lg hover:bg-olive-700/90 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Novo
          </Link>
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-gray-500">
        {filtered.length} produto{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Nenhum produto encontrado"
          description="Tente ajustar os filtros ou crie um novo produto."
          action={
            <Link href="/admin/products/new" className="btn-primary">Criar produto</Link>
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-12" />
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Produto</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Categoria</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Preço</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Disponível</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Destaque</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Thumbnail */}
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        {item.imageUrl ? (
                          <Image src={item.imageUrl} alt="" width={40} height={40} className="object-cover w-full h-full" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageOff className="w-4 h-4 text-gray-300" />
                          </div>
                        )}
                      </div>
                    </td>
                    {/* Name */}
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800 line-clamp-1">{item.name}</p>
                      {item.badge?.pt && (
                        <span className="text-[10px] text-amber-600 font-semibold">{item.badge.pt}</span>
                      )}
                    </td>
                    {/* Category */}
                    <td className="px-4 py-3 text-gray-500">
                      {catMap.get(item.categoryId) ?? item.categoryId}
                    </td>
                    {/* Price */}
                    <td className="px-4 py-3 text-right font-semibold text-gray-800">
                      {formatCurrency(item.price)}
                    </td>
                    {/* Available toggle */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        <AvailabilityToggle
                          checked={item.available}
                          onChange={v => onToggleAvailable(item.id, v)}
                        />
                      </div>
                    </td>
                    {/* Featured toggle */}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onToggleFeatured(item.id, !item.featured)}
                        aria-label={item.featured ? "Remover destaque" : "Destacar"}
                        className={`transition-colors ${item.featured ? "text-amber-500" : "text-gray-300 hover:text-amber-400"}`}
                      >
                        <Star className={`w-5 h-5 ${item.featured ? "fill-amber-500" : ""}`} />
                      </button>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Link
                          href={`/admin/products/${item.id}`}
                          className="p-1.5 text-gray-400 hover:text-olive-700 hover:bg-olive-700/8 rounded-lg transition-colors"
                          aria-label="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => onDuplicate(item.id)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          aria-label="Duplicar"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Select({ value, onChange, children }: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-olive-500/30 focus:border-olive-500 cursor-pointer"
      >
        {children}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
    </div>
  );
}
