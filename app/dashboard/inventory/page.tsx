"use client";

import { useEffect, useState } from "react";
import { Plus, Search, AlertTriangle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  getInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getProducts,
} from "@/lib/firestore";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";
import type { InventoryItem, Product } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import PageHeader from "@/components/page-header";
import Modal from "@/components/modal";
import LoadingSpinner from "@/components/loading-spinner";

export default function InventoryPage() {
  const { t } = useI18n();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    productId: "",
    productName: "",
    warehouseId: "main",
    warehouseName: "Main Warehouse",
    quantity: 0,
    reservedQuantity: 0,
  });

  const load = async () => {
    setLoading(true);
    try {
      const [inv, prods] = await Promise.all([getInventory(), getProducts()]);
      setItems(inv);
      setProducts(prods);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      productId: products[0]?.id ?? "",
      productName: products[0]?.name ?? "",
      warehouseId: "main",
      warehouseName: "Main Warehouse",
      quantity: 0,
      reservedQuantity: 0,
    });
    setModalOpen(true);
  };

  const openEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setForm({
      productId: item.productId,
      productName: item.productName,
      warehouseId: item.warehouseId,
      warehouseName: item.warehouseName,
      quantity: item.quantity,
      reservedQuantity: item.reservedQuantity,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateInventoryItem(editingId, {
          quantity: form.quantity,
          reservedQuantity: form.reservedQuantity,
        });
        toast.success(t("inventory.updated"));
      } else {
        await addInventoryItem(form);
        toast.success(t("inventory.added"));
      }
      setModalOpen(false);
      load();
    } catch {
      toast.error("Failed to save inventory");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this inventory item?")) return;
    try {
      await deleteInventoryItem(id);
      toast.success(t("inventory.deleted"));
      load();
    } catch {
      toast.error("Failed to delete item");
    }
  };

  const handleProductSelect = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    setForm({
      ...form,
      productId,
      productName: prod?.name ?? "",
    });
  };

  const filtered = items.filter(
    (i) =>
      i.productName.toLowerCase().includes(search.toLowerCase()) ||
      i.warehouseName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title={t("inventory.title")}
        description={t("inventory.desc")}
        action={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={16} /> {t("inventory.addStock")}
          </button>
        }
      />

      <div className="mb-4 relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder={t("inventory.search")}
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
                <th className="px-4 py-3">{t("inventory.product")}</th>
                <th className="px-4 py-3">{t("inventory.warehouse")}</th>
                <th className="px-4 py-3">{t("inventory.quantity")}</th>
                <th className="px-4 py-3">{t("inventory.reserved")}</th>
                <th className="px-4 py-3">{t("inventory.available")}</th>
                <th className="px-4 py-3">{t("common.status")}</th>
                <th className="px-4 py-3 text-right">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    {t("inventory.noItems")}
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const available = item.quantity - item.reservedQuantity;
                  const isLow = item.quantity <= LOW_STOCK_THRESHOLD;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {item.productName}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{item.warehouseName}</td>
                      <td className="px-4 py-3 text-slate-600">{item.quantity}</td>
                      <td className="px-4 py-3 text-slate-600">{item.reservedQuantity}</td>
                      <td className="px-4 py-3 text-slate-600">{available}</td>
                      <td className="px-4 py-3">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                            <AlertTriangle size={12} /> {t("inventory.lowStock")}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                            {t("inventory.inStock")}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => openEdit(item)}
                          className="rounded px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                        >
                          {t("inventory.updateStock")}
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="ml-2 rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? t("inventory.updateStock") : t("inventory.addItem")}
      >
        <form onSubmit={handleSave} className="space-y-4">
          {!editingId && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Product</label>
              <select
                value={form.productId}
                onChange={(e) => handleProductSelect(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}
          {!editingId && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Warehouse Name
              </label>
              <input
                required
                value={form.warehouseName}
                onChange={(e) =>
                  setForm({ ...form, warehouseName: e.target.value, warehouseId: e.target.value.toLowerCase().replace(/\s/g, "-") })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Quantity</label>
              <input
                type="number"
                required
                min={0}
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: parseInt(e.target.value) || 0 })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Reserved</label>
              <input
                type="number"
                min={0}
                value={form.reservedQuantity}
                onChange={(e) =>
                  setForm({
                    ...form,
                    reservedQuantity: parseInt(e.target.value) || 0,
                  })
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
