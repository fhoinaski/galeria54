"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, Tag, LogOut, Coffee,
  Store, Armchair, Users, CalendarDays, MessageSquare, BarChart3,
} from "lucide-react";

const NAV = [
  { href: "/admin",            label: "Dashboard",    icon: LayoutDashboard, exact: true },
  { href: "/admin/products",   label: "Produtos",     icon: ShoppingBag,     exact: false },
  { href: "/admin/categories", label: "Categorias",   icon: Tag,             exact: false },
  { href: "/admin/tables",     label: "Mesas",        icon: Armchair,        exact: false },
  { href: "/admin/sessions",   label: "Sessões",      icon: Users,           exact: false },
  { href: "/admin/events",     label: "Eventos",      icon: CalendarDays,    exact: false },
  { href: "/admin/feedbacks",  label: "Feedbacks",    icon: MessageSquare,   exact: false },
  { href: "/admin/analytics",  label: "Analytics",    icon: BarChart3,       exact: false },
  { href: "/admin/business",   label: "Configurações", icon: Store,          exact: false },
];

export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <aside className="w-56 shrink-0 flex flex-col bg-white border-r border-gray-100 min-h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-olive-700 rounded-lg flex items-center justify-center">
            <Coffee className="w-4 h-4 text-white" />
          </div>
          <div className="leading-none">
            <p className="font-serif text-sm font-semibold text-olive-700">
              <span className="italic">Caffè</span> 54
            </p>
            <p className="text-[10px] text-gray-400 tracking-wide uppercase mt-0.5">Admin</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Menu admin">
        {NAV.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={`
              flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${isActive(href, exact)
                ? "bg-olive-700/8 text-olive-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              }
            `}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sair
        </button>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors mt-0.5"
        >
          Ver cardápio →
        </Link>
      </div>
    </aside>
  );
}
