import type { Metadata } from "next";
import Link from "next/link";
import { Package, Tag, TrendingUp, AlertCircle, Star, Clock } from "lucide-react";
import { menuRepository } from "@/lib/menu-repository";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const stats = await menuRepository.getAdminStats();

  const cards = [
    {
      label: "Total de produtos",
      value: stats.totalProducts,
      icon: Package,
      color: "text-olive-700",
      bg: "bg-olive-700/8",
      href: "/admin/products",
    },
    {
      label: "Disponíveis",
      value: stats.availableProducts,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
      href: "/admin/products?filter=available",
    },
    {
      label: "Indisponíveis",
      value: stats.unavailableProducts,
      icon: AlertCircle,
      color: "text-red-500",
      bg: "bg-red-50",
      href: "/admin/products?filter=unavailable",
    },
    {
      label: "Em destaque",
      value: stats.featuredProducts,
      icon: Star,
      color: "text-amber-500",
      bg: "bg-amber-50",
      href: "/admin/products?filter=featured",
    },
    {
      label: "Categorias ativas",
      value: stats.activeCategories,
      icon: Tag,
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: "/admin/categories",
    },
  ];

  const lastUpdated = stats.lastUpdated
    ? new Date(stats.lastUpdated).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Dashboard"
        subtitle="Visão geral do cardápio"
      />

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map(({ label, value, icon: Icon, color, bg, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-sm transition-all group"
          >
            <div className={`inline-flex p-2.5 rounded-xl ${bg} mb-4`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5 group-hover:text-gray-700 transition-colors">{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-4">Ações rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-olive-700 text-white text-sm font-medium rounded-lg hover:bg-olive-700/90 transition-colors"
          >
            + Novo produto
          </Link>
          <Link
            href="/admin/categories"
            className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Gerenciar categorias
          </Link>
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Ver cardápio →
          </Link>
        </div>
      </div>

      {/* Last updated */}
      {lastUpdated && (
        <p className="flex items-center gap-1.5 text-xs text-gray-400">
          <Clock className="w-3.5 h-3.5" />
          Última atualização: {lastUpdated}
        </p>
      )}
    </div>
  );
}
