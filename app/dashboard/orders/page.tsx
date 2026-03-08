"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Eye, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  getOrders,
  addOrder,
  updateOrderStatus,
  deleteOrder,
  getProducts,
  getRetailers,
  getSalesmen,
} from "@/lib/firestore";
import { useAuth } from "@/lib/auth-context";
import type { Order, OrderItem, Product, Retailer, UserProfile, OrderStatus } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import PageHeader from "@/components/page-header";
import Modal from "@/components/modal";
import StatusBadge from "@/components/status-badge";
import LoadingSpinner from "@/components/loading-spinner";

export default function OrdersPage() {
  const { t, formatCurrency } = useI18n();
  const { profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [salesmen, setSalesmen] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModal, setDetailModal] = useState<Order | null>(null);

  const [form, setForm] = useState({
    retailerId: "",
    retailerName: "",
    salesmanId: "",
    salesmanName: "",
  });
  const [orderItems, setOrderItems] = useState<
    { productId: string; productName: string; quantity: number; price: number }[]
  >([]);

  const load = async () => {
    setLoading(true);
    try {
      const [o, p, r, s] = await Promise.all([
        getOrders(),
        getProducts(),
        getRetailers(),
        getSalesmen(),
      ]);
      setOrders(o);
      setProducts(p);
      setRetailers(r);
      setSalesmen(s);
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
      salesmanId: profile?.uid ?? "",
      salesmanName: profile?.name ?? "",
    });
    setOrderItems([]);
    setModalOpen(true);
  };

  const addItem = () => {
    if (products.length === 0) return;
    setOrderItems([
      ...orderItems,
      {
        productId: products[0].id,
        productName: products[0].name,
        quantity: 1,
        price: products[0].price,
      },
    ]);
  };

  const updateItem = (idx: number, field: string, value: string | number) => {
    const updated = [...orderItems];
    if (field === "productId") {
      const prod = products.find((p) => p.id === value);
      updated[idx] = {
        ...updated[idx],
        productId: value as string,
        productName: prod?.name ?? "",
        price: prod?.price ?? 0,
      };
    } else {
      (updated[idx] as Record<string, unknown>)[field] = value;
    }
    setOrderItems(updated);
  };

  const removeItem = (idx: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== idx));
  };

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (orderItems.length === 0) {
      toast.error(t("orders.addAtLeastOne"));
      return;
    }
    try {
      await addOrder({
        retailerId: form.retailerId,
        retailerName: form.retailerName,
        salesmanId: form.salesmanId,
        salesmanName: form.salesmanName,
        status: "pending",
        items: orderItems,
        totalAmount,
      });
      toast.success(t("orders.created"));
      setModalOpen(false);
      load();
    } catch {
      toast.error("Failed to create order");
    }
  };

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(id, status);
      toast.success(t("orders.statusUpdated"));
      load();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this order? This cannot be undone.")) return;
    try {
      await deleteOrder(id);
      toast.success(t("orders.deleted"));
      load();
    } catch {
      toast.error("Failed to delete order");
    }
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.retailerName.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? o.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <PageHeader
        title={t("orders.title")}
        description={t("orders.desc")}
        action={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={16} /> {t("orders.new")}
          </button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t("orders.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">{t("orders.allStatuses")}</option>
          <option value="pending">{t("orders.status.pending")}</option>
          <option value="confirmed">{t("orders.status.confirmed")}</option>
          <option value="processing">{t("orders.status.processing")}</option>
          <option value="shipped">{t("orders.status.shipped")}</option>
          <option value="delivered">{t("orders.status.delivered")}</option>
          <option value="cancelled">{t("orders.status.cancelled")}</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">{t("orders.orderId")}</th>
                <th className="px-4 py-3">{t("orders.retailer")}</th>
                <th className="px-4 py-3">{t("orders.salesman")}</th>
                <th className="px-4 py-3">{t("orders.items")}</th>
                <th className="px-4 py-3">{t("orders.total")}</th>
                <th className="px-4 py-3">{t("common.status")}</th>
                <th className="px-4 py-3">{t("common.date")}</th>
                <th className="px-4 py-3 text-right">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    {t("orders.noOrders")}
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">
                      {o.id.slice(0, 8)}...
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {o.retailerName}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{o.salesmanName}</td>
                    <td className="px-4 py-3 text-slate-600">{o.items?.length ?? 0}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {formatCurrency(o.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setDetailModal(o)}
                        className="mr-2 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-blue-600"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(o.id)}
                        className="mr-2 rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                      {o.status !== "delivered" && o.status !== "cancelled" && (
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) handleStatusChange(o.id, e.target.value as OrderStatus);
                          }}
                          className="rounded border border-slate-300 px-2 py-1 text-xs"
                        >
                          <option value="">{t("orders.updateStatus")}</option>
                          <option value="confirmed">{t("orders.confirm")}</option>
                          <option value="processing">{t("orders.process")}</option>
                          <option value="shipped">{t("orders.ship")}</option>
                          <option value="delivered">{t("orders.deliver")}</option>
                          <option value="cancelled">{t("orders.status.cancelled")}</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Order Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t("orders.create")}
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
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Order Items</label>
              <button
                type="button"
                onClick={addItem}
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                + Add Item
              </button>
            </div>
            {orderItems.map((item, idx) => (
              <div key={idx} className="mb-2 flex items-center gap-2">
                <select
                  value={item.productId}
                  onChange={(e) => updateItem(idx, "productId", e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(idx, "quantity", parseInt(e.target.value) || 1)
                  }
                  className="w-20 rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                  placeholder="Qty"
                />
                <span className="text-sm text-slate-500 w-20">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="text-red-400 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
            {orderItems.length > 0 && (
              <p className="mt-2 text-right text-sm font-semibold text-slate-900">
                Total: {formatCurrency(totalAmount)}
              </p>
            )}
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
              {t("orders.create")}
            </button>
          </div>
        </form>
      </Modal>

      {/* Order Detail Modal */}
      <Modal
        open={!!detailModal}
        onClose={() => setDetailModal(null)}
        title={t("orders.orderDetails")}
      >
        {detailModal && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Order ID</p>
                <p className="font-mono text-xs">{detailModal.id}</p>
              </div>
              <div>
                <p className="text-slate-500">Status</p>
                <StatusBadge status={detailModal.status} />
              </div>
              <div>
                <p className="text-slate-500">Retailer</p>
                <p className="font-medium">{detailModal.retailerName}</p>
              </div>
              <div>
                <p className="text-slate-500">Salesman</p>
                <p className="font-medium">{detailModal.salesmanName}</p>
              </div>
              <div>
                <p className="text-slate-500">Date</p>
                <p>{new Date(detailModal.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-500">Total</p>
                <p className="text-lg font-bold">{formatCurrency(detailModal.totalAmount)}</p>
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">Items</p>
              <div className="rounded-lg border border-slate-200">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-500">
                    <tr>
                      <th className="px-3 py-2 text-left">Product</th>
                      <th className="px-3 py-2 text-right">Qty</th>
                      <th className="px-3 py-2 text-right">Price</th>
                      <th className="px-3 py-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {detailModal.items?.map((item, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2">{item.productName}</td>
                        <td className="px-3 py-2 text-right">{item.quantity}</td>
                        <td className="px-3 py-2 text-right">{formatCurrency(item.price)}</td>
                        <td className="px-3 py-2 text-right font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
