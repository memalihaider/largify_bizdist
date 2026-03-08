"use client";

import { useEffect, useState } from "react";
import { Clock, ShoppingCart, Package, CreditCard, Users, AlertTriangle } from "lucide-react";
import { getOrders, getPayments, getInventory } from "@/lib/firestore";
import { useI18n } from "@/lib/i18n";
import type { Order, Payment, InventoryItem } from "@/lib/types";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";
import PageHeader from "@/components/page-header";
import LoadingSpinner from "@/components/loading-spinner";

interface ActivityEvent {
  id: string;
  type: "order" | "payment" | "low_stock";
  title: string;
  description: string;
  timestamp: string;
}

export default function ActivityPage() {
  const { t, formatCurrency } = useI18n();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<ActivityEvent[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [orders, payments, inventory] = await Promise.all([
          getOrders(),
          getPayments(),
          getInventory(),
        ]);

        const allEvents: ActivityEvent[] = [];

        orders.forEach((o: Order) => {
          allEvents.push({
            id: `order-${o.id}`,
            type: "order",
            title: `${t("orders.title")}: ${o.retailerName}`,
            description: `${o.items?.length ?? 0} ${t("orders.items")} — ${formatCurrency(o.totalAmount)} — ${o.status}`,
            timestamp: o.createdAt,
          });
        });

        payments.forEach((p: Payment) => {
          allEvents.push({
            id: `payment-${p.id}`,
            type: "payment",
            title: `${t("payments.title")}: ${p.retailerName}`,
            description: `${formatCurrency(p.amount)} — ${p.method}`,
            timestamp: p.date + "T00:00:00",
          });
        });

        inventory
          .filter((i: InventoryItem) => i.quantity <= LOW_STOCK_THRESHOLD)
          .forEach((i: InventoryItem) => {
            allEvents.push({
              id: `stock-${i.id}`,
              type: "low_stock",
              title: `${t("inventory.lowStock")}: ${i.productName}`,
              description: `${i.quantity} ${t("inventory.available")} — ${i.warehouseName}`,
              timestamp: new Date().toISOString(),
            });
          });

        allEvents.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        setEvents(allEvents);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [t, formatCurrency]);

  const iconFor = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingCart size={16} className="text-blue-600" />;
      case "payment":
        return <CreditCard size={16} className="text-green-600" />;
      case "low_stock":
        return <AlertTriangle size={16} className="text-red-600" />;
      default:
        return <Package size={16} className="text-slate-500" />;
    }
  };

  const bgFor = (type: string) => {
    switch (type) {
      case "order":
        return "bg-blue-100";
      case "payment":
        return "bg-green-100";
      case "low_stock":
        return "bg-red-100";
      default:
        return "bg-slate-100";
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title={t("activity.title")} description={t("activity.desc")} />

      {events.length === 0 ? (
        <div className="mt-8 text-center text-slate-400">
          <Users size={48} className="mx-auto mb-2 opacity-50" />
          <p>{t("activity.noActivity")}</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className={`mt-0.5 rounded-lg p-2 ${bgFor(event.type)}`}>
                {iconFor(event.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900">{event.title}</p>
                <p className="text-sm text-slate-500">{event.description}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400 whitespace-nowrap">
                <Clock size={12} />
                {new Date(event.timestamp).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
