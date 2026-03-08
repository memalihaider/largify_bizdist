export type UserRole = "admin" | "manager" | "salesman" | "retailer";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  barcode?: string;
  batchNumber?: string;
  expiryDate?: string;
  createdAt: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  reservedQuantity: number;
}

export interface Retailer {
  id: string;
  shopName: string;
  ownerName: string;
  phone: string;
  address: string;
  city: string;
  creditLimit: number;
  createdAt: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  retailerId: string;
  retailerName: string;
  salesmanId: string;
  salesmanName: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
}

export type PaymentMethod = "cash" | "bank_transfer" | "digital_wallet";

export interface Payment {
  id: string;
  orderId?: string;
  retailerId: string;
  retailerName: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  date: string;
  createdAt: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalRetailers: number;
  pendingOrders: number;
  lowStockItems: number;
}

export interface SalesDataPoint {
  date: string;
  amount: number;
}
