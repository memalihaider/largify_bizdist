export const PRODUCT_CATEGORIES = [
  "FMCG",
  "Electronics",
  "Pharmaceuticals",
  "Mobile Accessories",
  "Beverages",
  "Snacks",
  "Personal Care",
  "Household",
  "Other",
] as const;

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-indigo-100 text-indigo-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "digital_wallet", label: "Digital Wallet" },
] as const;

export const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  manager: "Distributor Manager",
  salesman: "Salesman",
  retailer: "Retailer",
};

export const LOW_STOCK_THRESHOLD = 10;
