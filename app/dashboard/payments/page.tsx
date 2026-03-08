"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { getPayments, addPayment, deletePayment, getRetailers, getOrders } from "@/lib/firestore";
import { PAYMENT_METHODS } from "@/lib/constants";
import type { Payment, PaymentMethod, Retailer, Order } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import PageHeader from "@/components/page-header";
import Modal from "@/components/modal";
import LoadingSpinner from "@/components/loading-spinner";

export default function PaymentsPage() {
  const { t, formatCurrency } = useI18n();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    retailerId: "",
    retailerName: "",
    orderId: "",
    amount: 0,
    method: "cash" as PaymentMethod,
    reference: "",
    date: new Date().toISOString().split("T")[0],
  });

  const load = async () => {
    setLoading(true);
    try {
      const [p, r, o] = await Promise.all([getPayments(), getRetailers(), getOrders()]);
      setPayments(p);
      setRetailers(r);
      setOrders(o);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setForm({
      retailerId: retailers[0]?.id ?? "",
      retailerName: retailers[0]?.shopName ?? "",
      orderId: "",
      amount: 0,
      method: "cash",
      reference: "",
      date: new Date().toISOString().split("T")[0],
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addPayment(form);
      toast.success(t("payments.recorded"));
      setModalOpen(false);
      load();
    } catch {
      toast.error("Failed to record payment");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this payment record?")) return;
    try {
      await deletePayment(id);
      toast.success(t("payments.deleted"));
      load();
    } catch {
      toast.error("Failed to delete payment");
    }
  };

  const totalCollected = payments.reduce((s, p) => s + p.amount, 0);

  const filtered = payments.filter(
    (p) =>
      p.retailerName.toLowerCase().includes(search.toLowerCase()) ||
      p.method.toLowerCase().includes(search.toLowerCase()) ||
      (p.reference ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const methodLabel = (m: string) =>
    PAYMENT_METHODS.find((pm) => pm.value === m)?.label ?? m;

  return (
    <div>
      <PageHeader
        title={t("payments.title")}
        description={`${t("payments.totalCollected")}: ${formatCurrency(totalCollected)}`}
        action={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={16} /> {t("payments.record")}
          </button>
        }
      />

      <div className="mb-4 relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder={t("payments.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">{t("orders.retailer")}</th>
                <th className="px-4 py-3">{t("payments.amount")}</th>
                <th className="px-4 py-3">{t("payments.method")}</th>
                <th className="px-4 py-3">{t("payments.reference")}</th>
                <th className="px-4 py-3">{t("common.date")}</th>
                <th className="px-4 py-3 text-right">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    {t("payments.noPayments")}
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{p.retailerName}</td>
                    <td className="px-4 py-3 font-medium text-green-600">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                        {methodLabel(p.method)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{p.reference || "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{p.date}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t("payments.record")}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Retailer</label>
            <select
              value={form.retailerId}
              onChange={(e) => {
                const r = retailers.find((r) => r.id === e.target.value);
                setForm({
                  ...form,
                  retailerId: e.target.value,
                  retailerName: r?.shopName ?? "",
                });
              }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {retailers.map((r) => (
                <option key={r.id} value={r.id}>{r.shopName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Order (optional)
            </label>
            <select
              value={form.orderId}
              onChange={(e) => setForm({ ...form, orderId: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">No specific order</option>
              {orders
                .filter((o) => o.retailerId === form.retailerId)
                .map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.id.slice(0, 8)}... — {formatCurrency(o.totalAmount)}
                  </option>
                ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">{t("payments.amount")}</label>
              <input
                type="number"
                required
                min={0.01}
                step={0.01}
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: parseFloat(e.target.value) || 0 })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Method</label>
              <select
                value={form.method}
                onChange={(e) =>
                  setForm({ ...form, method: e.target.value as PaymentMethod })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Reference</label>
              <input
                value={form.reference}
                onChange={(e) => setForm({ ...form, reference: e.target.value })}
                placeholder="Transaction ID, check #, etc."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Date</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {t("payments.record")}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
