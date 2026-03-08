"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart,
  DollarSign,
  Package,
  Store,
  Clock,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { getOrders, getProducts, getRetailers, getInventory } from "@/lib/firestore";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";
import type { Order, Product } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import PageHeader from "@/components/page-header";
import StatCard from "@/components/stat-card";
import LoadingSpinner from "@/components/loading-spinner";

const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalRetailers: 0,
    pendingOrders: 0,
    lowStockItems: 0,
  });
  const [salesData, setSalesData] = useState<{ date: string; amount: number }[]>([]);
  const [topProducts, setTopProducts] = useState<{ name: string; value: number }[]>([]);
  const [ordersByStatus, setOrdersByStatus] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [orders, products, retailers, inventory] = await Promise.all([
          getOrders(),
          getProducts(),
          getRetailers(),
          getInventory(),
        ]);

        const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0);
        const pendingOrders = orders.filter((o) => o.status === "pending").length;
        const lowStockItems = inventory.filter(
          (i) => i.quantity <= LOW_STOCK_THRESHOLD
        ).length;

        setStats({
          totalOrders: orders.length,
          totalRevenue,
          totalProducts: products.length,
          totalRetailers: retailers.length,
          pendingOrders,
          lowStockItems,
        });

        // Sales over last 7 days
        const last7 = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return d.toISOString().split("T")[0];
        });
        const salesMap = new Map<string, number>();
        last7.forEach((d) => salesMap.set(d, 0));
        orders.forEach((o) => {
          const day = o.createdAt.split("T")[0];
          if (salesMap.has(day)) {
            salesMap.set(day, (salesMap.get(day) ?? 0) + o.totalAmount);
          }
        });
        setSalesData(
          last7.map((d) => ({
            date: d.slice(5),
            amount: salesMap.get(d) ?? 0,
          }))
        );

        // Top products by order frequency
        const productCount = new Map<string, number>();
        orders.forEach((o) =>
          o.items?.forEach((item) => {
            productCount.set(
              item.productName,
              (productCount.get(item.productName) ?? 0) + item.quantity
            );
          })
        );
        setTopProducts(
          Array.from(productCount.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, value]) => ({ name, value }))
        );

        // Orders by status
        const statusCount = new Map<string, number>();
        orders.forEach((o) =>
          statusCount.set(o.status, (statusCount.get(o.status) ?? 0) + 1)
        );
        setOrdersByStatus(
          Array.from(statusCount.entries()).map(([name, value]) => ({
            name,
            value,
          }))
        );
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const { t, formatCurrency } = useI18n();

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title={t("dashboard.title")}
        description={t("dashboard.desc")}
      />

      {/* Stat Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title={t("dashboard.totalOrders")}
          value={stats.totalOrders}
          icon={ShoppingCart}
          color="bg-blue-600"
        />
        <StatCard
          title={t("dashboard.revenue")}
          value={formatCurrency(stats.totalRevenue)}
          icon={DollarSign}
          color="bg-green-600"
        />
        <StatCard
          title={t("dashboard.products")}
          value={stats.totalProducts}
          icon={Package}
          color="bg-purple-600"
        />
        <StatCard
          title={t("dashboard.retailers")}
          value={stats.totalRetailers}
          icon={Store}
          color="bg-orange-500"
        />
        <StatCard
          title={t("dashboard.pending")}
          value={stats.pendingOrders}
          icon={Clock}
          color="bg-yellow-500"
        />
        <StatCard
          title={t("dashboard.lowStock")}
          value={stats.lowStockItems}
          icon={AlertTriangle}
          color="bg-red-500"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sales Trend */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-900">
            {t("dashboard.salesLast7")}
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-900">
            {t("dashboard.topProducts")}
          </h3>
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-16 text-center text-sm text-slate-400">
              No order data yet
            </p>
          )}
        </div>

        {/* Orders by Status */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-900">
            {t("dashboard.ordersByStatus")}
          </h3>
          {ordersByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={ordersByStatus}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {ordersByStatus.map((_, i) => (
                    <Cell
                      key={i}
                      fill={PIE_COLORS[i % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-16 text-center text-sm text-slate-400">
              No order data yet
            </p>
          )}
        </div>

        {/* Recent Activity placeholder */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-900">
            {t("dashboard.quickActions")}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <a
              href="/dashboard/orders"
              className="rounded-lg border border-slate-200 p-4 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              <ShoppingCart size={24} className="mx-auto mb-2 text-blue-500" />
              {t("dashboard.newOrder")}
            </a>
            <a
              href="/dashboard/products"
              className="rounded-lg border border-slate-200 p-4 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              <Package size={24} className="mx-auto mb-2 text-purple-500" />
              {t("dashboard.addProduct")}
            </a>
            <a
              href="/dashboard/retailers"
              className="rounded-lg border border-slate-200 p-4 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              <Store size={24} className="mx-auto mb-2 text-orange-500" />
              {t("dashboard.addRetailer")}
            </a>
            <a
              href="/dashboard/payments"
              className="rounded-lg border border-slate-200 p-4 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              <DollarSign size={24} className="mx-auto mb-2 text-green-500" />
              {t("dashboard.recordPayment")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
