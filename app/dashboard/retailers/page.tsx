"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";
import { getRetailers, addRetailer, updateRetailer, deleteRetailer } from "@/lib/firestore";
import type { Retailer } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import PageHeader from "@/components/page-header";
import Modal from "@/components/modal";
import LoadingSpinner from "@/components/loading-spinner";

const emptyForm = {
  shopName: "",
  ownerName: "",
  phone: "",
  address: "",
  city: "",
  creditLimit: 0,
};

export default function RetailersPage() {
  const { t, formatCurrency } = useI18n();
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    try {
      setRetailers(await getRetailers());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (r: Retailer) => {
    setEditingId(r.id);
    setForm({
      shopName: r.shopName,
      ownerName: r.ownerName,
      phone: r.phone,
      address: r.address,
      city: r.city,
      creditLimit: r.creditLimit,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateRetailer(editingId, form);
        toast.success(t("retailers.updated"));
      } else {
        await addRetailer(form);
        toast.success(t("retailers.created"));
      }
      setModalOpen(false);
      load();
    } catch {
      toast.error("Failed to save retailer");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this retailer?")) return;
    try {
      await deleteRetailer(id);
      toast.success(t("retailers.deleted"));
      load();
    } catch {
      toast.error("Failed to delete retailer");
    }
  };

  const filtered = retailers.filter(
    (r) =>
      r.shopName.toLowerCase().includes(search.toLowerCase()) ||
      r.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      r.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title={t("retailers.title")}
        description={t("retailers.desc")}
        action={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={16} /> {t("retailers.add")}
          </button>
        }
      />

      <div className="mb-4 relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder={t("retailers.search")}
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
                <th className="px-4 py-3">{t("retailers.shopName")}</th>
                <th className="px-4 py-3">{t("retailers.owner")}</th>
                <th className="px-4 py-3">{t("common.phone")}</th>
                <th className="px-4 py-3">{t("retailers.city")}</th>
                <th className="px-4 py-3">{t("retailers.creditLimit")}</th>
                <th className="px-4 py-3 text-right">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    No retailers found
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{r.shopName}</td>
                    <td className="px-4 py-3 text-slate-600">{r.ownerName}</td>
                    <td className="px-4 py-3 text-slate-600">{r.phone}</td>
                    <td className="px-4 py-3 text-slate-600">{r.city}</td>
                    <td className="px-4 py-3 text-slate-600">{formatCurrency(r.creditLimit ?? 0)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openEdit(r)}
                        className="mr-2 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-blue-600"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-600"
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
        title={editingId ? t("retailers.edit") : t("retailers.add")}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Shop Name</label>
            <input
              required
              value={form.shopName}
              onChange={(e) => setForm({ ...form, shopName: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Owner Name</label>
              <input
                required
                value={form.ownerName}
                onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
              <input
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Address</label>
            <input
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">City</label>
              <input
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Credit Limit ($)</label>
              <input
                type="number"
                min={0}
                value={form.creditLimit}
                onChange={(e) =>
                  setForm({ ...form, creditLimit: parseFloat(e.target.value) || 0 })
                }
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
              {editingId ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
