"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import type { UserRole } from "@/lib/types";

export default function RegisterPage() {
  const { signUp } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("salesman");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error(t("auth.passwordLength"));
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, name, role);
      router.push("/dashboard");
    } catch {
      toast.error(t("auth.registrationFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600">
            <Package size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Largify BizDist</h1>
          <p className="mt-1 text-sm text-slate-500">{t("auth.createAccount")}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <h2 className="mb-6 text-lg font-semibold text-slate-900">
            {t("auth.signUp")}
          </h2>

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              {t("auth.fullName")}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              {t("auth.email")}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="you@company.com"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              {t("auth.password")}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Min 6 characters"
            />
          </div>

          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              {t("auth.role")}
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="admin">{t("role.admin")}</option>
              <option value="manager">{t("role.manager")}</option>
              <option value="salesman">{t("role.salesman")}</option>
              <option value="retailer">{t("role.retailer")}</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? t("auth.creatingAccount") : t("auth.createAccount")}
          </button>

          <p className="mt-4 text-center text-sm text-slate-500">
            {t("auth.haveAccount")}{" "}
            <a
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              {t("auth.signIn")}
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
