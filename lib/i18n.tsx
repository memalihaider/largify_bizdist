"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type Locale = "en" | "ur";
export type CurrencyCode = "PKR" | "USD" | "EUR" | "GBP" | "SAR" | "AED";

interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  position: "before" | "after";
  rate: number; // conversion rate relative to PKR (PKR = 1)
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  PKR: { code: "PKR", symbol: "Rs", label: "Pakistani Rupee (PKR)", position: "before", rate: 1 },
  USD: { code: "USD", symbol: "$", label: "US Dollar (USD)", position: "before", rate: 0.0036 },
  EUR: { code: "EUR", symbol: "€", label: "Euro (EUR)", position: "before", rate: 0.0033 },
  GBP: { code: "GBP", symbol: "£", label: "British Pound (GBP)", position: "before", rate: 0.0028 },
  SAR: { code: "SAR", symbol: "SAR", label: "Saudi Riyal (SAR)", position: "before", rate: 0.0134 },
  AED: { code: "AED", symbol: "AED", label: "UAE Dirham (AED)", position: "before", rate: 0.0132 },
};

// ── Translations ─────────────────────────────────────────
const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Common
    "app.name": "Largify BizDist",
    "app.tagline": "Distribution Management System",
    "common.search": "Search",
    "common.cancel": "Cancel",
    "common.create": "Create",
    "common.update": "Update",
    "common.add": "Add",
    "common.delete": "Delete",
    "common.save": "Save",
    "common.edit": "Edit",
    "common.actions": "Actions",
    "common.status": "Status",
    "common.date": "Date",
    "common.name": "Name",
    "common.phone": "Phone",
    "common.email": "Email",
    "common.noData": "No data found",
    "common.loading": "Loading...",
    "common.confirm": "Confirm",
    "common.yes": "Yes",
    "common.no": "No",
    "common.all": "All",
    "common.export": "Export",
    "common.today": "Today",
    "common.signOut": "Sign Out",

    // Auth
    "auth.signIn": "Sign In",
    "auth.signUp": "Register",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.fullName": "Full Name",
    "auth.role": "Role",
    "auth.signingIn": "Signing in...",
    "auth.creatingAccount": "Creating account...",
    "auth.createAccount": "Create Account",
    "auth.noAccount": "Don't have an account?",
    "auth.haveAccount": "Already have an account?",
    "auth.register": "Register",
    "auth.invalidCredentials": "Invalid email or password",
    "auth.registrationFailed": "Registration failed. Try a different email.",
    "auth.passwordLength": "Password must be at least 6 characters",

    // Landing
    "landing.hero.title": "Distribution Management",
    "landing.hero.highlight": "Made Simple",
    "landing.hero.desc": "Centralize your products, warehouses, orders, retailers and payments. Get real-time visibility into your entire supply chain.",
    "landing.hero.cta": "Start Free",
    "landing.features.products.title": "Product Catalog",
    "landing.features.products.desc": "Track products with SKU, pricing, batches and expiry dates.",
    "landing.features.inventory.title": "Inventory Control",
    "landing.features.inventory.desc": "Real-time stock tracking with low-stock alerts across multiple warehouses.",
    "landing.features.orders.title": "Order Management",
    "landing.features.orders.desc": "Full order lifecycle from creation to delivery with status tracking.",
    "landing.features.analytics.title": "Sales Analytics",
    "landing.features.analytics.desc": "Charts and dashboards for sales performance and business insights.",
    "landing.roles.title": "Built for Every Role",
    "landing.roles.desc": "From warehouse managers to field salesmen, everyone gets a dedicated view.",
    "landing.roles.admin": "Full system control and analytics",
    "landing.roles.manager": "Stock management and order tracking",
    "landing.roles.salesman": "Create orders and track visits",
    "landing.roles.retailer": "Place orders and view invoices",
    "landing.stats.title": "Trusted by Businesses",
    "landing.stats.products": "Products Managed",
    "landing.stats.orders": "Orders Processed",
    "landing.stats.retailers": "Active Retailers",
    "landing.stats.uptime": "Uptime",

    // Sidebar / Navigation
    "nav.dashboard": "Dashboard",
    "nav.products": "Products",
    "nav.inventory": "Inventory",
    "nav.orders": "Orders",
    "nav.retailers": "Retailers",
    "nav.payments": "Payments",
    "nav.sales": "Sales",
    "nav.activityLog": "Activity Log",
    "nav.settings": "Settings",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.desc": "Overview of your distribution operations",
    "dashboard.totalOrders": "Total Orders",
    "dashboard.revenue": "Revenue",
    "dashboard.products": "Products",
    "dashboard.retailers": "Retailers",
    "dashboard.pending": "Pending",
    "dashboard.lowStock": "Low Stock",
    "dashboard.salesLast7": "Sales (Last 7 Days)",
    "dashboard.topProducts": "Top Products",
    "dashboard.ordersByStatus": "Orders by Status",
    "dashboard.quickActions": "Quick Actions",
    "dashboard.newOrder": "New Order",
    "dashboard.addProduct": "Add Product",
    "dashboard.addRetailer": "Add Retailer",
    "dashboard.recordPayment": "Record Payment",

    // Products
    "products.title": "Products",
    "products.desc": "Manage your product catalog",
    "products.add": "Add Product",
    "products.edit": "Edit Product",
    "products.search": "Search products...",
    "products.category": "Category",
    "products.sku": "SKU",
    "products.price": "Price",
    "products.barcode": "Barcode",
    "products.batch": "Batch Number",
    "products.expiry": "Expiry Date",
    "products.unit": "Unit",
    "products.description": "Description",
    "products.noProducts": "No products found",
    "products.deleted": "Product deleted",
    "products.created": "Product created",
    "products.updated": "Product updated",

    // Inventory
    "inventory.title": "Inventory",
    "inventory.desc": "Track stock across warehouses",
    "inventory.addStock": "Add Stock",
    "inventory.updateStock": "Update Stock",
    "inventory.addItem": "Add Inventory Item",
    "inventory.search": "Search inventory...",
    "inventory.product": "Product",
    "inventory.warehouse": "Warehouse",
    "inventory.quantity": "Quantity",
    "inventory.reserved": "Reserved",
    "inventory.available": "Available",
    "inventory.lowStock": "Low Stock",
    "inventory.inStock": "In Stock",
    "inventory.noItems": "No inventory items found",
    "inventory.deleted": "Item deleted",
    "inventory.added": "Inventory item added",
    "inventory.updated": "Inventory updated",

    // Orders
    "orders.title": "Orders",
    "orders.desc": "Manage customer orders",
    "orders.new": "New Order",
    "orders.create": "Create Order",
    "orders.search": "Search orders...",
    "orders.orderId": "Order ID",
    "orders.retailer": "Retailer",
    "orders.salesman": "Salesman",
    "orders.items": "Items",
    "orders.total": "Total",
    "orders.noOrders": "No orders found",
    "orders.addItem": "+ Add Item",
    "orders.product": "Product",
    "orders.qty": "Qty",
    "orders.price": "Price",
    "orders.created": "Order created",
    "orders.deleted": "Order deleted",
    "orders.statusUpdated": "Status updated",
    "orders.addAtLeastOne": "Add at least one item",
    "orders.allStatuses": "All Statuses",
    "orders.orderDetails": "Order Details",
    "orders.status.pending": "Pending",
    "orders.status.confirmed": "Confirmed",
    "orders.status.processing": "Processing",
    "orders.status.shipped": "Shipped",
    "orders.status.delivered": "Delivered",
    "orders.status.cancelled": "Cancelled",
    "orders.updateStatus": "Update",
    "orders.confirm": "Confirm",
    "orders.process": "Process",
    "orders.ship": "Ship",
    "orders.deliver": "Deliver",

    // Retailers
    "retailers.title": "Retailers",
    "retailers.desc": "Manage your retail partners",
    "retailers.add": "Add Retailer",
    "retailers.edit": "Edit Retailer",
    "retailers.search": "Search retailers...",
    "retailers.shopName": "Shop Name",
    "retailers.owner": "Owner",
    "retailers.city": "City",
    "retailers.address": "Address",
    "retailers.creditLimit": "Credit Limit",
    "retailers.noRetailers": "No retailers found",
    "retailers.deleted": "Retailer deleted",
    "retailers.created": "Retailer added",
    "retailers.updated": "Retailer updated",

    // Payments
    "payments.title": "Payments",
    "payments.totalCollected": "Total collected",
    "payments.record": "Record Payment",
    "payments.search": "Search payments...",
    "payments.amount": "Amount",
    "payments.method": "Method",
    "payments.reference": "Reference",
    "payments.order": "Order (optional)",
    "payments.noSpecificOrder": "No specific order",
    "payments.noPayments": "No payments found",
    "payments.deleted": "Payment deleted",
    "payments.recorded": "Payment recorded",
    "payments.method.cash": "Cash",
    "payments.method.bank_transfer": "Bank Transfer",
    "payments.method.digital_wallet": "Digital Wallet",
    "payments.method.cheque": "Cheque",
    "payments.method.credit": "Credit",
    "payments.method.upi": "UPI",

    // Sales
    "sales.title": "Sales Analytics",
    "sales.myDashboard": "My Sales Dashboard",
    "sales.companyWide": "Company-wide sales performance",
    "sales.welcomeBack": "Welcome back",
    "sales.totalOrders": "Total Orders",
    "sales.totalRevenue": "Total Revenue",
    "sales.paymentsCollected": "Payments Collected",
    "sales.retailersServed": "Retailers Served",
    "sales.revenueLast14": "Revenue (Last 14 Days)",
    "sales.ordersPerDay": "Orders per Day",
    "sales.recentOrders": "Recent Orders",
    "sales.noOrders": "No orders yet",

    // Roles
    "role.admin": "Admin",
    "role.manager": "Distributor Manager",
    "role.salesman": "Salesman",
    "role.retailer": "Retailer",

    // Activity Log
    "activity.title": "Activity Log",
    "activity.desc": "Recent system activity and audit trail",
    "activity.noActivity": "No recent activity",

    // Settings
    "settings.title": "Settings",
    "settings.desc": "Application preferences",
    "settings.language": "Language",
    "settings.currency": "Currency",
    "settings.theme": "Theme",
  },
  ur: {
    // Common
    "app.name": "لارجیفائ بز ڈسٹ",
    "app.tagline": "تقسیم کا انتظام",
    "common.search": "تلاش",
    "common.cancel": "منسوخ",
    "common.create": "بنائیں",
    "common.update": "اپ ڈیٹ",
    "common.add": "شامل کریں",
    "common.delete": "حذف",
    "common.save": "محفوظ",
    "common.edit": "ترمیم",
    "common.actions": "ایکشنز",
    "common.status": "حالت",
    "common.date": "تاریخ",
    "common.name": "نام",
    "common.phone": "فون",
    "common.email": "ای میل",
    "common.noData": "کوئی ڈیٹا نہیں ملا",
    "common.loading": "لوڈ ہو رہا ہے...",
    "common.confirm": "تصدیق",
    "common.yes": "ہاں",
    "common.no": "نہیں",
    "common.all": "سب",
    "common.export": "برآمد",
    "common.today": "آج",
    "common.signOut": "سائن آؤٹ",

    // Auth
    "auth.signIn": "سائن ان",
    "auth.signUp": "رجسٹر",
    "auth.email": "ای میل",
    "auth.password": "پاس ورڈ",
    "auth.fullName": "پورا نام",
    "auth.role": "کردار",
    "auth.signingIn": "سائن ان ہو رہا ہے...",
    "auth.creatingAccount": "اکاؤنٹ بنایا جا رہا ہے...",
    "auth.createAccount": "اکاؤنٹ بنائیں",
    "auth.noAccount": "اکاؤنٹ نہیں ہے؟",
    "auth.haveAccount": "پہلے سے اکاؤنٹ ہے؟",
    "auth.register": "رجسٹر",
    "auth.invalidCredentials": "غلط ای میل یا پاس ورڈ",
    "auth.registrationFailed": "رجسٹریشن ناکام۔ مختلف ای میل آزمائیں۔",
    "auth.passwordLength": "پاس ورڈ کم از کم 6 حروف کا ہونا چاہیے",

    // Landing
    "landing.hero.title": "تقسیم کا انتظام",
    "landing.hero.highlight": "آسان بنایا",
    "landing.hero.desc": "اپنی مصنوعات، گوداموں، آرڈرز، خوردہ فروشوں اور ادائیگیوں کو مرکزی بنائیں۔ اپنی پوری سپلائی چین کی ریئل ٹائم نگرانی حاصل کریں۔",
    "landing.hero.cta": "مفت شروع کریں",
    "landing.features.products.title": "مصنوعات کیٹلاگ",
    "landing.features.products.desc": "SKU، قیمت، بیچ اور ایکسپائری تاریخ کے ساتھ مصنوعات ٹریک کریں۔",
    "landing.features.inventory.title": "اسٹاک کنٹرول",
    "landing.features.inventory.desc": "متعدد گوداموں میں کم اسٹاک الرٹس کے ساتھ ریئل ٹائم ٹریکنگ۔",
    "landing.features.orders.title": "آرڈر مینجمنٹ",
    "landing.features.orders.desc": "تخلیق سے ڈیلیوری تک مکمل آرڈر لائف سائیکل۔",
    "landing.features.analytics.title": "سیلز تجزیات",
    "landing.features.analytics.desc": "سیلز کارکردگی اور کاروباری بصیرت کے لیے چارٹ اور ڈیش بورڈ۔",
    "landing.roles.title": "ہر کردار کے لیے بنایا گیا",
    "landing.roles.desc": "گودام مینیجرز سے فیلڈ سیلزمین تک، ہر ایک کو مخصوص منظر ملتا ہے۔",
    "landing.roles.admin": "مکمل سسٹم کنٹرول اور تجزیات",
    "landing.roles.manager": "اسٹاک مینجمنٹ اور آرڈر ٹریکنگ",
    "landing.roles.salesman": "آرڈرز بنائیں اور وزٹ ٹریک کریں",
    "landing.roles.retailer": "آرڈرز دیں اور انوائس دیکھیں",
    "landing.stats.title": "کاروباری اعتماد",
    "landing.stats.products": "مصنوعات زیر انتظام",
    "landing.stats.orders": "آرڈرز پروسیس شدہ",
    "landing.stats.retailers": "فعال خوردہ فروش",
    "landing.stats.uptime": "اپ ٹائم",

    // Sidebar / Navigation
    "nav.dashboard": "ڈیش بورڈ",
    "nav.products": "مصنوعات",
    "nav.inventory": "اسٹاک",
    "nav.orders": "آرڈرز",
    "nav.retailers": "خوردہ فروش",
    "nav.payments": "ادائیگیاں",
    "nav.sales": "سیلز",
    "nav.activityLog": "سرگرمی لاگ",
    "nav.settings": "ترتیبات",

    // Dashboard
    "dashboard.title": "ڈیش بورڈ",
    "dashboard.desc": "آپ کی تقسیم کے آپریشنز کا جائزہ",
    "dashboard.totalOrders": "کل آرڈرز",
    "dashboard.revenue": "آمدنی",
    "dashboard.products": "مصنوعات",
    "dashboard.retailers": "خوردہ فروش",
    "dashboard.pending": "زیر التوا",
    "dashboard.lowStock": "کم اسٹاک",
    "dashboard.salesLast7": "سیلز (آخری 7 دن)",
    "dashboard.topProducts": "ٹاپ مصنوعات",
    "dashboard.ordersByStatus": "حالت کے مطابق آرڈرز",
    "dashboard.quickActions": "فوری ایکشنز",
    "dashboard.newOrder": "نیا آرڈر",
    "dashboard.addProduct": "مصنوعات شامل کریں",
    "dashboard.addRetailer": "خوردہ فروش شامل کریں",
    "dashboard.recordPayment": "ادائیگی ریکارڈ",

    // Products
    "products.title": "مصنوعات",
    "products.desc": "اپنی مصنوعات کیٹلاگ کا انتظام کریں",
    "products.add": "مصنوعات شامل کریں",
    "products.edit": "مصنوعات ترمیم",
    "products.search": "مصنوعات تلاش کریں...",
    "products.category": "زمرہ",
    "products.sku": "SKU",
    "products.price": "قیمت",
    "products.barcode": "بارکوڈ",
    "products.batch": "بیچ نمبر",
    "products.expiry": "ایکسپائری تاریخ",
    "products.unit": "اکائی",
    "products.description": "تفصیل",
    "products.noProducts": "کوئی مصنوعات نہیں ملیں",
    "products.deleted": "مصنوعات حذف ہو گئی",
    "products.created": "مصنوعات بنائی گئی",
    "products.updated": "مصنوعات اپ ڈیٹ ہو گئی",

    // Inventory
    "inventory.title": "اسٹاک",
    "inventory.desc": "گوداموں میں اسٹاک ٹریک کریں",
    "inventory.addStock": "اسٹاک شامل کریں",
    "inventory.updateStock": "اسٹاک اپ ڈیٹ",
    "inventory.addItem": "اسٹاک آئٹم شامل کریں",
    "inventory.search": "اسٹاک تلاش کریں...",
    "inventory.product": "مصنوعات",
    "inventory.warehouse": "گودام",
    "inventory.quantity": "مقدار",
    "inventory.reserved": "ریزرو",
    "inventory.available": "دستیاب",
    "inventory.lowStock": "کم اسٹاک",
    "inventory.inStock": "اسٹاک میں",
    "inventory.noItems": "کوئی اسٹاک آئٹم نہیں ملا",
    "inventory.deleted": "آئٹم حذف ہو گیا",
    "inventory.added": "اسٹاک آئٹم شامل ہو گیا",
    "inventory.updated": "اسٹاک اپ ڈیٹ ہو گیا",

    // Orders
    "orders.title": "آرڈرز",
    "orders.desc": "کسٹمر آرڈرز کا انتظام کریں",
    "orders.new": "نیا آرڈر",
    "orders.create": "آرڈر بنائیں",
    "orders.search": "آرڈرز تلاش کریں...",
    "orders.orderId": "آرڈر ID",
    "orders.retailer": "خوردہ فروش",
    "orders.salesman": "سیلزمین",
    "orders.items": "آئٹمز",
    "orders.total": "کل",
    "orders.noOrders": "کوئی آرڈرز نہیں ملے",
    "orders.addItem": "+ آئٹم شامل کریں",
    "orders.product": "مصنوعات",
    "orders.qty": "مقدار",
    "orders.price": "قیمت",
    "orders.created": "آرڈر بنایا گیا",
    "orders.deleted": "آرڈر حذف ہو گیا",
    "orders.statusUpdated": "حالت اپ ڈیٹ ہو گئی",
    "orders.addAtLeastOne": "کم از کم ایک آئٹم شامل کریں",
    "orders.allStatuses": "تمام حالتیں",
    "orders.orderDetails": "آرڈر تفصیلات",
    "orders.status.pending": "زیر التوا",
    "orders.status.confirmed": "تصدیق شدہ",
    "orders.status.processing": "پروسیسنگ",
    "orders.status.shipped": "بھیجا گیا",
    "orders.status.delivered": "ڈیلیور ہو گیا",
    "orders.status.cancelled": "منسوخ",
    "orders.updateStatus": "اپ ڈیٹ",
    "orders.confirm": "تصدیق",
    "orders.process": "پروسیس",
    "orders.ship": "بھیجیں",
    "orders.deliver": "ڈیلیور",

    // Retailers
    "retailers.title": "خوردہ فروش",
    "retailers.desc": "اپنے خوردہ شراکت داروں کا انتظام کریں",
    "retailers.add": "خوردہ فروش شامل کریں",
    "retailers.edit": "خوردہ فروش ترمیم",
    "retailers.search": "خوردہ فروش تلاش کریں...",
    "retailers.shopName": "دکان کا نام",
    "retailers.owner": "مالک",
    "retailers.city": "شہر",
    "retailers.address": "پتہ",
    "retailers.creditLimit": "کریڈٹ حد",
    "retailers.noRetailers": "کوئی خوردہ فروش نہیں ملا",
    "retailers.deleted": "خوردہ فروش حذف ہو گیا",
    "retailers.created": "خوردہ فروش شامل ہو گیا",
    "retailers.updated": "خوردہ فروش اپ ڈیٹ ہو گیا",

    // Payments
    "payments.title": "ادائیگیاں",
    "payments.totalCollected": "کل وصولی",
    "payments.record": "ادائیگی ریکارڈ کریں",
    "payments.search": "ادائیگیاں تلاش کریں...",
    "payments.amount": "رقم",
    "payments.method": "طریقہ",
    "payments.reference": "حوالہ",
    "payments.order": "آرڈر (اختیاری)",
    "payments.noSpecificOrder": "کوئی مخصوص آرڈر نہیں",
    "payments.noPayments": "کوئی ادائیگیاں نہیں ملیں",
    "payments.deleted": "ادائیگی حذف ہو گئی",
    "payments.recorded": "ادائیگی ریکارڈ ہو گئی",
    "payments.method.cash": "نقد",
    "payments.method.bank_transfer": "بینک ٹرانسفر",
    "payments.method.digital_wallet": "ڈیجیٹل والیٹ",
    "payments.method.cheque": "چیک",
    "payments.method.credit": "کریڈٹ",
    "payments.method.upi": "UPI",

    // Sales
    "sales.title": "سیلز تجزیات",
    "sales.myDashboard": "میرا سیلز ڈیش بورڈ",
    "sales.companyWide": "کمپنی بھر کی سیلز کارکردگی",
    "sales.welcomeBack": "خوش آمدید",
    "sales.totalOrders": "کل آرڈرز",
    "sales.totalRevenue": "کل آمدنی",
    "sales.paymentsCollected": "وصول شدہ ادائیگیاں",
    "sales.retailersServed": "خوردہ فروش خدمت گزار",
    "sales.revenueLast14": "آمدنی (آخری 14 دن)",
    "sales.ordersPerDay": "فی دن آرڈرز",
    "sales.recentOrders": "حالیہ آرڈرز",
    "sales.noOrders": "ابھی تک کوئی آرڈر نہیں",

    // Roles
    "role.admin": "ایڈمن",
    "role.manager": "ڈسٹریبیوٹر مینیجر",
    "role.salesman": "سیلزمین",
    "role.retailer": "خوردہ فروش",

    // Activity Log
    "activity.title": "سرگرمی لاگ",
    "activity.desc": "حالیہ سسٹم سرگرمی اور آڈٹ ٹریل",
    "activity.noActivity": "کوئی حالیہ سرگرمی نہیں",

    // Settings
    "settings.title": "ترتیبات",
    "settings.desc": "ایپلیکیشن کی ترجیحات",
    "settings.language": "زبان",
    "settings.currency": "کرنسی",
    "settings.theme": "تھیم",
  },
};

// ── Context ──────────────────────────────────────────────
interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  t: (key: string) => string;
  formatCurrency: (amount: number) => string;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");
  const [currency, setCurrency] = useState<CurrencyCode>("PKR");

  const t = (key: string): string => {
    return translations[locale]?.[key] ?? translations.en[key] ?? key;
  };

  const formatCurrency = (amount: number): string => {
    const cfg = CURRENCIES[currency];
    const formatted = amount.toLocaleString(locale === "ur" ? "ur-PK" : "en-US", {
      minimumFractionDigits: currency === "PKR" ? 0 : 2,
      maximumFractionDigits: 2,
    });
    return cfg.position === "before"
      ? `${cfg.symbol} ${formatted}`
      : `${formatted} ${cfg.symbol}`;
  };

  const dir = locale === "ur" ? "rtl" : "ltr";

  return (
    <I18nContext.Provider
      value={{ locale, setLocale, currency, setCurrency, t, formatCurrency, dir }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
