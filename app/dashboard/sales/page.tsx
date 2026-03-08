"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { getOrders, getPayments, getRetailers } from "@/lib/firestore";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import type { Order, Payment } from "@/lib/types";
import PageHeader from "@/components/page-header";
import StatCard from "@/components/stat-card";
import StatusBadge from "@/components/status-badge";
import LoadingSpinner from "@/components/loading-spinner";

export default function SalesPage() {
  const { t, formatCurrency } = useI18n();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [dailySales, setDailySales] = useState<{ date: string; orders: number; revenue: number }[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [allOrders, allPayments] = await Promise.all([
          getOrders(),
          getPayments(),
        ]);

        // If salesman, only show their data
        const myOrders =
          profile?.role === "salesman"
            ? allOrders.filter((o) => o.salesmanId === profile.uid)
            : allOrders;

        setOrders(myOrders);
        setPayments(allPayments);

        // Daily breakdown (last 14 days)
        const last14 = Array.from({ length: 14 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (13 - i));
          return d.toISOString().split("T")[0];
        });

        const dailyMap = new Map<string, { orders: number; revenue: number }>();
        last14.forEach((d) => dailyMap.set(d, { orders: 0, revenue: 0 }));

        myOrders.forEach((o) => {
          const day = o.createdAt.split("T")[0];
          if (dailyMap.has(day)) {
            const cur = dailyMap.get(day)!;
            dailyMap.set(day, {
              orders: cur.orders + 1,
              revenue: cur.revenue + o.totalAmount,
            });
          }
        });

        setDailySales(
          last14.map((d) => ({
            date: d.slice(5),
            orders: dailyMap.get(d)?.orders ?? 0,
            revenue: dailyMap.get(d)?.revenue ?? 0,
          }))
        );
      } catch (err) {
        console.error("Sales load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [profile]);

  if (loading) return <LoadingSpinner />;

  const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0);
  const totalPayments = payments.reduce((s, p) => s + p.amount, 0);
  const todaysOrders = orders.filter(
    (o) => o.createdAt.split("T")[0] === new Date().toISOString().split("T")[0]
  );
  const uniqueRetailers = new Set(orders.map((o) => o.retailerId)).size;

  return (
    <div>
      <PageHeader
        title={profile?.role === "salesman" ? t("sales.myDashboard") : t("sales.title")}
        description={
          profile?.role === "salesman"
            ? `${t("sales.welcomeBack")}, ${profile.name}`
            : t("sales.companyWide")
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("sales.totalOrders")}
          value={orders.length}
          icon={ShoppingCart}
          color="bg-blue-600"
          subtitle={`${todaysOrders.length} ${t("common.today")}`}
        />
        <StatCard
          title={t("sales.totalRevenue")}
          value={formatCurrency(totalRevenue)}
          icon={TrendingUp}
          color="bg-green-600"
        />
        <StatCard
          title={t("sales.paymentsCollected")}
          value={formatCurrency(totalPayments)}
          icon={DollarSign}
          color="bg-purple-600"
        />
        <StatCard
          title={t("sales.retailersServed")}
          value={uniqueRetailers}
          icon={Users}
          color="bg-orange-500"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Trend */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-900">
            {t("sales.revenueLast14")}
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dailySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" fontSize={11} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders per Day */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-900">
            {t("sales.ordersPerDay")}
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dailySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" fontSize={11} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="text-sm font-semibold text-slate-900">{t("sales.recentOrders")}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">{t("orders.orderId")}</th>
                <th className="px-4 py-3">{t("orders.retailer")}</th>
                <th className="px-4 py-3">{t("payments.amount")}</th>
                <th className="px-4 py-3">{t("common.status")}</th>
                <th className="px-4 py-3">{t("common.date")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.slice(0, 10).map((o) => (
                <tr key={o.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">
                    {o.id.slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {o.retailerName}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {formatCurrency(o.totalAmount)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    {t("sales.noOrders")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
