"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import {
  Package,
  ArrowRight,
  BarChart3,
  ShoppingCart,
  Store,
  Warehouse,
  Shield,
  Globe,
  Zap,
  CheckCircle2,
} from "lucide-react";
import LoadingSpinner from "@/components/loading-spinner";

export default function Home() {
  const { user, loading } = useAuth();
  const { t, locale, setLocale } = useI18n();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-600 p-1.5">
              <Package size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">Largify BizDist</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocale(locale === "en" ? "ur" : "en")}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
            >
              <Globe size={16} className="inline mr-1" />
              {locale === "en" ? "اردو" : "English"}
            </button>
            <a
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              {t("auth.signIn")}
            </a>
            <a
              href="/register"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {t("landing.hero.cta")}
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-blue-100 opacity-40 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-purple-100 opacity-40 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-24 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
              <Zap size={14} /> {t("landing.stats.title")}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              {t("landing.hero.title")}
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("landing.hero.highlight")}
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
              {t("landing.hero.desc")}
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <a
                href="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 transition-all"
              >
                {t("landing.hero.cta")} <ArrowRight size={16} />
              </a>
              <a
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-8 py-3.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
              >
                {t("auth.signIn")}
              </a>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {[
                { value: "10K+", label: t("landing.stats.products") },
                { value: "50K+", label: t("landing.stats.orders") },
                { value: "2K+", label: t("landing.stats.retailers") },
                { value: "99.9%", label: t("landing.stats.uptime") },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{s.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Package,
                titleKey: "landing.features.products.title",
                descKey: "landing.features.products.desc",
                color: "bg-blue-100 text-blue-600",
              },
              {
                icon: Warehouse,
                titleKey: "landing.features.inventory.title",
                descKey: "landing.features.inventory.desc",
                color: "bg-purple-100 text-purple-600",
              },
              {
                icon: ShoppingCart,
                titleKey: "landing.features.orders.title",
                descKey: "landing.features.orders.desc",
                color: "bg-green-100 text-green-600",
              },
              {
                icon: BarChart3,
                titleKey: "landing.features.analytics.title",
                descKey: "landing.features.analytics.desc",
                color: "bg-orange-100 text-orange-600",
              },
            ].map((f) => (
              <div
                key={f.titleKey}
                className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-200"
              >
                <div className={`mb-3 inline-flex rounded-lg p-2.5 ${f.color}`}>
                  <f.icon size={22} />
                </div>
                <h3 className="mb-1 font-semibold text-slate-900">{t(f.titleKey)}</h3>
                <p className="text-sm text-slate-500">{t(f.descKey)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Multi-language & Multi-currency highlight */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="grid gap-8 sm:grid-cols-3 text-center text-white">
              <div className="flex flex-col items-center gap-3">
                <Globe size={32} />
                <h3 className="text-lg font-semibold">{locale === "ur" ? "کثیر لسانی" : "Multi-Language"}</h3>
                <p className="text-sm text-blue-100">{locale === "ur" ? "انگریزی اور اردو سپورٹ" : "English & Urdu with RTL support"}</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <Shield size={32} />
                <h3 className="text-lg font-semibold">{locale === "ur" ? "کثیر کرنسی" : "Multi-Currency"}</h3>
                <p className="text-sm text-blue-100">{locale === "ur" ? "PKR، USD، EUR، GBP اور مزید" : "PKR, USD, EUR, GBP & more"}</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <CheckCircle2 size={32} />
                <h3 className="text-lg font-semibold">{locale === "ur" ? "کردار پر مبنی" : "Role-Based Access"}</h3>
                <p className="text-sm text-blue-100">{locale === "ur" ? "ایڈمن، مینیجر، سیلزمین، خوردہ فروش" : "Admin, Manager, Salesman, Retailer"}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Roles */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16 text-center">
            <h2 className="text-2xl font-bold text-slate-900">
              {t("landing.roles.title")}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-slate-500">
              {t("landing.roles.desc")}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { roleKey: "role.admin", descKey: "landing.roles.admin" },
                { roleKey: "role.manager", descKey: "landing.roles.manager" },
                { roleKey: "role.salesman", descKey: "landing.roles.salesman" },
                { roleKey: "role.retailer", descKey: "landing.roles.retailer" },
              ].map((r) => (
                <div
                  key={r.roleKey}
                  className="group rounded-xl border border-slate-200 p-5 transition-all hover:border-blue-200 hover:shadow-md"
                >
                  <Store size={28} className="mx-auto mb-2 text-blue-500" />
                  <h4 className="font-semibold text-slate-900">{t(r.roleKey)}</h4>
                  <p className="mt-1 text-sm text-slate-500">{t(r.descKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-400">
        &copy; {new Date().getFullYear()} Largify BizDist. Distribution Management System.
      </footer>
    </div>
  );
}
