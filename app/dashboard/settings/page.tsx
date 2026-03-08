"use client";

import { Globe, DollarSign } from "lucide-react";
import { useI18n, CURRENCIES } from "@/lib/i18n";
import type { Locale, CurrencyCode } from "@/lib/i18n";
import PageHeader from "@/components/page-header";

export default function SettingsPage() {
  const { t, locale, setLocale, currency, setCurrency } = useI18n();

  return (
    <div>
      <PageHeader title={t("settings.title")} description={t("settings.desc")} />

      <div className="mt-6 max-w-2xl space-y-6">
        {/* Language */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-blue-100 p-2">
              <Globe size={18} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{t("settings.language")}</h3>
              <p className="text-sm text-slate-500">
                {locale === "ur" ? "ایپلیکیشن کی زبان منتخب کریں" : "Choose application language"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { code: "en" as Locale, label: "English", nativeLabel: "English" },
              { code: "ur" as Locale, label: "Urdu", nativeLabel: "اردو" },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLocale(lang.code)}
                className={`rounded-lg border p-4 text-left transition-all ${
                  locale === lang.code
                    ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <p className="font-medium text-slate-900">{lang.nativeLabel}</p>
                <p className="text-sm text-slate-500">{lang.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Currency */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-green-100 p-2">
              <DollarSign size={18} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{t("settings.currency")}</h3>
              <p className="text-sm text-slate-500">
                {locale === "ur" ? "ڈیفالٹ کرنسی منتخب کریں" : "Choose default currency"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(CURRENCIES).map(([code, config]) => (
              <button
                key={code}
                onClick={() => setCurrency(code as CurrencyCode)}
                className={`rounded-lg border p-4 text-left transition-all ${
                  currency === code
                    ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <p className="font-medium text-slate-900">
                  {config.symbol} {code}
                </p>
                <p className="text-sm text-slate-500">{config.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
