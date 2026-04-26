"use client";

import { useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import type { Category } from "@/types/menu";
import { AvailabilityToggle } from "./AvailabilityToggle";
import { EmptyState } from "./EmptyState";
import { CategoryForm } from "./CategoryForm";

interface CategoryTableProps {
  categories: Category[];
  onToggleActive: (id: string, val: boolean) => void;
  onDelete: (id: string) => void;
  onSave: (data: Partial<Category>, id?: string) => void;
}

export function CategoryTable({ categories, onToggleActive, onDelete, onSave }: CategoryTableProps) {
  const [editing, setEditing] = useState<Category | null | "new">(null);

  function handleSave(data: Partial<Category>) {
    const id = editing !== "new" ? editing?.id : undefined;
    onSave(data, id);
    setEditing(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setEditing("new")}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-olive-700 text-white text-sm font-medium rounded-lg hover:bg-olive-700/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova categoria
        </button>
      </div>

      {/* Inline form */}
      {editing && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-800 text-sm mb-4">
            {editing === "new" ? "Nova categoria" : `Editar: ${(editing as Category).name.pt}`}
          </h3>
          <CategoryForm
            initialData={editing !== "new" ? editing : undefined}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      {categories.length === 0 ? (
        <EmptyState
          icon={Plus}
          title="Nenhuma categoria"
          description="Crie a primeira categoria para começar."
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nome</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Slug</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ordem</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ativa</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[...categories].sort((a, b) => a.order - b.order).map(cat => (
                <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{cat.name.pt}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{cat.slug}</td>
                  <td className="px-4 py-3 text-center text-gray-500">{cat.order}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <AvailabilityToggle
                        checked={cat.active}
                        onChange={v => onToggleActive(cat.id, v)}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => setEditing(cat)}
                        className="p-1.5 text-gray-400 hover:text-olive-700 hover:bg-olive-700/8 rounded-lg transition-colors"
                        aria-label="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(cat.id)}
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
      )}
    </div>
  );
}
