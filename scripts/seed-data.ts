// Run once: npx tsx scripts/seed-data.ts
// Seeds demo products, retailers, inventory, orders, and payments

import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyABdZ4dRnGJkkTi-P6IMzGZRjiSaObICHk",
  authDomain: "businessdist-ae102.firebaseapp.com",
  projectId: "businessdist-ae102",
  storageBucket: "businessdist-ae102.firebasestorage.app",
  messagingSenderId: "128597850384",
  appId: "1:128597850384:web:2940e9ec794b3e32268d95",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const now = new Date().toISOString();
const daysAgo = (n: number) =>
  new Date(Date.now() - n * 86_400_000).toISOString();

async function clear(col: string) {
  const snap = await getDocs(collection(db, col));
  await Promise.all(
    snap.docs.map((d) => {
      // soft delete not needed — just log
      return Promise.resolve();
    })
  );
}

async function seed() {
  console.log("🔐 Signing in as admin...");
  await signInWithEmailAndPassword(auth, "admin@largifybizdist.com", "123456");
  console.log("✅ Signed in\n");

  // ── Products ─────────────────────────────────────────────
  console.log("📦 Seeding products...");
  const productDefs = [
    { name: "Coca-Cola 330ml (Case of 24)", sku: "COKE-330-24", category: "FMCG", price: 18.99, unit: "case", description: "Classic Coca-Cola cans" },
    { name: "Pepsi 330ml (Case of 24)", sku: "PEPSI-330-24", category: "FMCG", price: 17.99, unit: "case", description: "Pepsi cola cans, chilled" },
    { name: "Lay's Classic Chips 40g x 24", sku: "LAYS-40-24", category: "FMCG", price: 22.50, unit: "box", description: "Lays classic salted chips" },
    { name: "Nestle Mineral Water 500ml x 24", sku: "NESTLE-500-24", category: "FMCG", price: 9.99, unit: "case", description: "Still mineral water" },
    { name: "Colgate Toothpaste 150ml x 12", sku: "COLGATE-150-12", category: "FMCG", price: 28.00, unit: "box", description: "Whitening toothpaste" },
    { name: "Samsung Galaxy A15", sku: "SAM-A15-BLK", category: "Electronics", price: 199.99, unit: "unit", description: "6.5\" FHD+ smartphone" },
    { name: "Sony TWS Earbuds WF-C500", sku: "SONY-WFC500", category: "Electronics", price: 79.99, unit: "unit", description: "Wireless earbuds, 20hr battery" },
    { name: "Anker 65W USB-C Charger", sku: "ANKER-65W", category: "Electronics", price: 34.99, unit: "unit", description: "GaN compact charger" },
    { name: "Paracetamol 500mg x 100 tabs", sku: "PARA-500-100", category: "Pharmaceuticals", price: 6.50, unit: "box", description: "Pain & fever relief" },
    { name: "Vitamin C 1000mg x 30 tabs", sku: "VITC-1000-30", category: "Pharmaceuticals", price: 12.00, unit: "box", description: "Immune support supplement" },
    { name: "Hand Sanitizer 500ml x 12", sku: "SANI-500-12", category: "FMCG", price: 36.00, unit: "box", description: "70% alcohol sanitizer" },
    { name: "JBL Portable Speaker Flip 6", sku: "JBL-FLIP6", category: "Electronics", price: 129.99, unit: "unit", description: "Waterproof BT speaker" },
  ];

  const productIds: string[] = [];
  for (const p of productDefs) {
    const ref = await addDoc(collection(db, "products"), { ...p, createdAt: daysAgo(30) });
    productIds.push(ref.id);
    process.stdout.write(".");
  }
  console.log(`\n✅ ${productDefs.length} products added\n`);

  // ── Retailers ─────────────────────────────────────────────
  console.log("🏪 Seeding retailers...");
  const retailerDefs = [
    { shopName: "Metro Mart", ownerName: "James Okafor", phone: "+1-555-0101", email: "james@metromart.com", address: "12 Market St, Chicago, IL" },
    { shopName: "QuickStop Convenience", ownerName: "Priya Sharma", phone: "+1-555-0202", email: "priya@quickstop.com", address: "45 Oak Ave, Houston, TX" },
    { shopName: "Valley Grocery Hub", ownerName: "Carlos Mendez", phone: "+1-555-0303", email: "carlos@valleygrocery.com", address: "88 Valley Rd, Phoenix, AZ" },
    { shopName: "Sunrise Superstore", ownerName: "Fatima Al-Rashid", phone: "+1-555-0404", email: "fatima@sunrise.com", address: "22 Sunrise Blvd, Dallas, TX" },
    { shopName: "City Electronics Hub", ownerName: "Kevin Park", phone: "+1-555-0505", email: "kevin@cityelectronics.com", address: "310 Tech Lane, San Jose, CA" },
    { shopName: "HealthFirst Pharmacy", ownerName: "Dr. Susan Obi", phone: "+1-555-0606", email: "susan@healthfirst.com", address: "77 Wellness Way, Miami, FL" },
    { shopName: "Downtown Depot", ownerName: "Marcus Williams", phone: "+1-555-0707", email: "marcus@downtowndepot.com", address: "5 Main Square, New York, NY" },
  ];

  const retailerIds: string[] = [];
  const retailerNames: string[] = [];
  for (const r of retailerDefs) {
    const ref = await addDoc(collection(db, "retailers"), { ...r, createdAt: daysAgo(25) });
    retailerIds.push(ref.id);
    retailerNames.push(r.shopName);
    process.stdout.write(".");
  }
  console.log(`\n✅ ${retailerDefs.length} retailers added\n`);

  // ── Inventory ─────────────────────────────────────────────
  console.log("🏭 Seeding inventory...");
  const warehouses = [
    { id: "main", name: "Main Warehouse" },
    { id: "east", name: "East Distribution Center" },
    { id: "west", name: "West Storage Facility" },
  ];

  for (let i = 0; i < productDefs.length; i++) {
    const wh = warehouses[i % warehouses.length];
    const qty = 50 + Math.floor(Math.random() * 200);
    const reserved = Math.floor(qty * 0.15);
    await addDoc(collection(db, "inventory"), {
      productId: productIds[i],
      productName: productDefs[i].name,
      warehouseId: wh.id,
      warehouseName: wh.name,
      quantity: qty,
      reservedQuantity: reserved,
    });
    process.stdout.write(".");
  }
  // Add a low-stock item
  await addDoc(collection(db, "inventory"), {
    productId: productIds[9],
    productName: productDefs[9].name,
    warehouseId: "east",
    warehouseName: "East Distribution Center",
    quantity: 5,
    reservedQuantity: 2,
  });
  console.log(`\n✅ ${productDefs.length + 1} inventory entries added\n`);

  // ── Orders ────────────────────────────────────────────────
  console.log("📋 Seeding orders...");
  const statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
  const orderData = [
    // Delivered orders (older)
    { retailerIdx: 0, items: [{ pi: 0, qty: 10 }, { pi: 2, qty: 5 }], status: "delivered", daysBack: 20 },
    { retailerIdx: 1, items: [{ pi: 4, qty: 8 }, { pi: 3, qty: 12 }], status: "delivered", daysBack: 18 },
    { retailerIdx: 2, items: [{ pi: 5, qty: 2 }, { pi: 7, qty: 3 }], status: "delivered", daysBack: 15 },
    { retailerIdx: 3, items: [{ pi: 6, qty: 5 }], status: "delivered", daysBack: 14 },
    { retailerIdx: 4, items: [{ pi: 8, qty: 20 }, { pi: 9, qty: 15 }], status: "delivered", daysBack: 12 },
    // Shipped
    { retailerIdx: 5, items: [{ pi: 1, qty: 15 }, { pi: 10, qty: 6 }], status: "shipped", daysBack: 8 },
    { retailerIdx: 6, items: [{ pi: 11, qty: 3 }, { pi: 6, qty: 2 }], status: "shipped", daysBack: 7 },
    // Processing
    { retailerIdx: 0, items: [{ pi: 0, qty: 20 }, { pi: 1, qty: 20 }], status: "processing", daysBack: 5 },
    { retailerIdx: 2, items: [{ pi: 3, qty: 30 }], status: "processing", daysBack: 4 },
    // Confirmed
    { retailerIdx: 1, items: [{ pi: 5, qty: 4 }], status: "confirmed", daysBack: 3 },
    { retailerIdx: 3, items: [{ pi: 7, qty: 6 }, { pi: 8, qty: 10 }], status: "confirmed", daysBack: 2 },
    // Pending
    { retailerIdx: 4, items: [{ pi: 9, qty: 20 }], status: "pending", daysBack: 1 },
    { retailerIdx: 5, items: [{ pi: 2, qty: 12 }, { pi: 4, qty: 6 }], status: "pending", daysBack: 1 },
    { retailerIdx: 6, items: [{ pi: 10, qty: 8 }], status: "pending", daysBack: 0 },
    // Cancelled
    { retailerIdx: 1, items: [{ pi: 11, qty: 2 }], status: "cancelled", daysBack: 10 },
  ];

  const orderIds: string[] = [];
  const orderAmounts: number[] = [];
  for (const o of orderData) {
    const items = o.items.map((it) => ({
      productId: productIds[it.pi],
      productName: productDefs[it.pi].name,
      quantity: it.qty,
      price: productDefs[it.pi].price,
    }));
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const ref = await addDoc(collection(db, "orders"), {
      retailerId: retailerIds[o.retailerIdx],
      retailerName: retailerNames[o.retailerIdx],
      salesmanId: "admin",
      salesmanName: "Admin",
      status: o.status,
      items,
      totalAmount: total,
      createdAt: daysAgo(o.daysBack),
    });
    orderIds.push(ref.id);
    orderAmounts.push(total);
    process.stdout.write(".");
  }
  console.log(`\n✅ ${orderData.length} orders added\n`);

  // ── Payments ──────────────────────────────────────────────
  console.log("💳 Seeding payments...");
  const methods = ["cash", "bank_transfer", "cheque", "upi", "credit"];
  const paymentData = [
    { retailerIdx: 0, orderIdx: 0, amount: orderAmounts[0], method: "bank_transfer", ref: "TXN-10023", daysBack: 19 },
    { retailerIdx: 1, orderIdx: 1, amount: orderAmounts[1], method: "cash", ref: "", daysBack: 17 },
    { retailerIdx: 2, orderIdx: 2, amount: orderAmounts[2], method: "cheque", ref: "CHQ-88421", daysBack: 14 },
    { retailerIdx: 3, orderIdx: 3, amount: orderAmounts[3], method: "upi", ref: "UPI-771234", daysBack: 13 },
    { retailerIdx: 4, orderIdx: 4, amount: orderAmounts[4], method: "bank_transfer", ref: "TXN-20045", daysBack: 11 },
    { retailerIdx: 5, orderIdx: 5, amount: orderAmounts[5] * 0.5, method: "cash", ref: "", daysBack: 6 },
    { retailerIdx: 6, orderIdx: 6, amount: orderAmounts[6], method: "credit", ref: "CRED-55321", daysBack: 6 },
    { retailerIdx: 0, orderIdx: 7, amount: 200, method: "bank_transfer", ref: "TXN-30012", daysBack: 4 },
    { retailerIdx: 2, orderIdx: 8, amount: orderAmounts[8], method: "upi", ref: "UPI-884512", daysBack: 3 },
    { retailerIdx: 1, orderIdx: 9, amount: orderAmounts[9], method: "cash", ref: "", daysBack: 2 },
  ];

  for (const p of paymentData) {
    const date = new Date(Date.now() - p.daysBack * 86_400_000).toISOString().split("T")[0];
    await addDoc(collection(db, "payments"), {
      retailerId: retailerIds[p.retailerIdx],
      retailerName: retailerNames[p.retailerIdx],
      orderId: orderIds[p.orderIdx] ?? "",
      amount: Math.round(p.amount * 100) / 100,
      method: p.method,
      reference: p.ref,
      date,
      createdAt: daysAgo(p.daysBack),
    });
    process.stdout.write(".");
  }
  console.log(`\n✅ ${paymentData.length} payments added\n`);

  console.log("🎉 All demo data seeded successfully!");
  console.log("\nSummary:");
  console.log(`  Products   : ${productDefs.length}`);
  console.log(`  Retailers  : ${retailerDefs.length}`);
  console.log(`  Inventory  : ${productDefs.length + 1}`);
  console.log(`  Orders     : ${orderData.length}`);
  console.log(`  Payments   : ${paymentData.length}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("\n❌ Seed failed:", err);
  process.exit(1);
});
