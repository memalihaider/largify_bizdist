import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  Product,
  Retailer,
  Order,
  OrderItem,
  Payment,
  InventoryItem,
  UserProfile,
} from "./types";

// ── Products ──────────────────────────────────────────────
export async function getProducts(): Promise<Product[]> {
  const snap = await getDocs(
    query(collection(db, "products"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
}

export async function addProduct(
  data: Omit<Product, "id" | "createdAt">
): Promise<string> {
  const ref = await addDoc(collection(db, "products"), {
    ...data,
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function updateProduct(
  id: string,
  data: Partial<Product>
): Promise<void> {
  await updateDoc(doc(db, "products", id), data);
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, "products", id));
}

// ── Retailers ─────────────────────────────────────────────
export async function getRetailers(): Promise<Retailer[]> {
  const snap = await getDocs(
    query(collection(db, "retailers"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Retailer);
}

export async function addRetailer(
  data: Omit<Retailer, "id" | "createdAt">
): Promise<string> {
  const ref = await addDoc(collection(db, "retailers"), {
    ...data,
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function updateRetailer(
  id: string,
  data: Partial<Retailer>
): Promise<void> {
  await updateDoc(doc(db, "retailers", id), data);
}

export async function deleteRetailer(id: string): Promise<void> {
  await deleteDoc(doc(db, "retailers", id));
}

// ── Orders ────────────────────────────────────────────────
export async function getOrders(): Promise<Order[]> {
  const snap = await getDocs(
    query(collection(db, "orders"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order);
}

export async function getOrdersByRetailer(
  retailerId: string
): Promise<Order[]> {
  const snap = await getDocs(
    query(
      collection(db, "orders"),
      where("retailerId", "==", retailerId),
      orderBy("createdAt", "desc")
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order);
}

export async function getOrdersBySalesman(
  salesmanId: string
): Promise<Order[]> {
  const snap = await getDocs(
    query(
      collection(db, "orders"),
      where("salesmanId", "==", salesmanId),
      orderBy("createdAt", "desc")
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order);
}

export async function addOrder(
  data: Omit<Order, "id" | "createdAt">
): Promise<string> {
  const ref = await addDoc(collection(db, "orders"), {
    ...data,
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function updateOrderStatus(
  id: string,
  status: string
): Promise<void> {
  await updateDoc(doc(db, "orders", id), { status });
}

export async function deleteOrder(id: string): Promise<void> {
  await deleteDoc(doc(db, "orders", id));
}

// ── Inventory ─────────────────────────────────────────────
export async function getInventory(): Promise<InventoryItem[]> {
  const snap = await getDocs(collection(db, "inventory"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as InventoryItem);
}

export async function addInventoryItem(
  data: Omit<InventoryItem, "id">
): Promise<string> {
  const ref = await addDoc(collection(db, "inventory"), data);
  return ref.id;
}

export async function updateInventoryItem(
  id: string,
  data: Partial<InventoryItem>
): Promise<void> {
  await updateDoc(doc(db, "inventory", id), data);
}

export async function deleteInventoryItem(id: string): Promise<void> {
  await deleteDoc(doc(db, "inventory", id));
}

// ── Payments ──────────────────────────────────────────────
export async function getPayments(): Promise<Payment[]> {
  const snap = await getDocs(
    query(collection(db, "payments"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Payment);
}

export async function addPayment(
  data: Omit<Payment, "id" | "createdAt">
): Promise<string> {
  const ref = await addDoc(collection(db, "payments"), {
    ...data,
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function deletePayment(id: string): Promise<void> {
  await deleteDoc(doc(db, "payments", id));
}

// ── Users ─────────────────────────────────────────────────
export async function getUserProfile(
  uid: string
): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return { uid: snap.id, ...snap.data() } as UserProfile;
}

export async function getUsers(): Promise<UserProfile[]> {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map(
    (d) => ({ uid: d.id, ...d.data() }) as UserProfile
  );
}

export async function getSalesmen(): Promise<UserProfile[]> {
  const snap = await getDocs(
    query(collection(db, "users"), where("role", "==", "salesman"))
  );
  return snap.docs.map(
    (d) => ({ uid: d.id, ...d.data() }) as UserProfile
  );
}
