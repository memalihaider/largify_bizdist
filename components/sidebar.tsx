"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingCart,
  Store,
  CreditCard,
  BarChart3,
  LogOut,
  Menu,
  X,
  Globe,
  Settings,
  ClipboardList,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n, CURRENCIES, type Locale, type CurrencyCode } from "@/lib/i18n";

const navItems = [
  { href: "/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { href: "/dashboard/products", labelKey: "nav.products", icon: Package },
  { href: "/dashboard/inventory", labelKey: "nav.inventory", icon: Warehouse },
  { href: "/dashboard/orders", labelKey: "nav.orders", icon: ShoppingCart },
  { href: "/dashboard/retailers", labelKey: "nav.retailers", icon: Store },
  { href: "/dashboard/payments", labelKey: "nav.payments", icon: CreditCard },
  { href: "/dashboard/sales", labelKey: "nav.sales", icon: BarChart3 },
  { href: "/dashboard/activity", labelKey: "nav.activityLog", icon: ClipboardList },
  { href: "/dashboard/settings", labelKey: "nav.settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const { t, locale, setLocale, currency, setCurrency } = useI18n();
  const [open, setOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-slate-800 p-2 text-white lg:hidden"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-900 text-white transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-slate-700 px-6">
          <div className="rounded-lg bg-blue-600 p-1.5">
            <Package size={20} className="text-white" />
          </div>
          <span className="text-lg font-bold">{t("app.name")}</span>
        </div>

        {profile && (
          <div className="border-b border-slate-700 px-6 py-3">
            <p className="text-sm font-medium">{profile.name}</p>
            <p className="text-xs text-slate-400">{t(`role.${profile.role}`)}</p>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon size={18} />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        {/* Language & Currency Switcher */}
        <div className="border-t border-slate-700 px-3 py-2">
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <Globe size={18} />
              <span>{locale === "ur" ? "اردو" : "English"}</span>
              <span className="ml-auto text-xs text-slate-500">{CURRENCIES[currency].symbol}</span>
            </button>
            {showLangMenu && (
              <div className="absolute bottom-full left-0 mb-1 w-full rounded-lg bg-slate-800 p-2 shadow-xl">
                <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  {t("settings.language")}
                </p>
                {(["en", "ur"] as Locale[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLocale(l); setShowLangMenu(false); }}
                    className={`block w-full rounded px-2 py-1.5 text-left text-xs ${
                      locale === l ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {l === "en" ? "English" : "اردو"}
                  </button>
                ))}
                <p className="mb-1 mt-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  {t("settings.currency")}
                </p>
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => { setCurrency(c); setShowLangMenu(false); }}
                    className={`block w-full rounded px-2 py-1.5 text-left text-xs ${
                      currency === c ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {CURRENCIES[c].symbol} — {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-700 p-3">
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <LogOut size={18} />
            {t("common.signOut")}
          </button>
        </div>
      </aside>
    </>
  );
}
