// Run once: npx tsx scripts/seed-roles.ts
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyABdZ4dRnGJkkTi-P6IMzGZRjiSaObICHk",
  authDomain: "businessdist-ae102.firebaseapp.com",
  projectId: "businessdist-ae102",
  storageBucket: "businessdist-ae102.firebasestorage.app",
  messagingSenderId: "128597850384",
  appId: "1:128597850384:web:2940e9ec794b3e32268d95",
  measurementId: "G-E91HHMXPJT",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const ROLES = [
  {
    email: "manager@largifybizdist.com",
    password: "123456",
    name: "Test Manager",
    role: "manager",
  },
  {
    email: "salesman@largifybizdist.com",
    password: "123456",
    name: "Test Salesman",
    role: "salesman",
  },
  {
    email: "retailer@largifybizdist.com",
    password: "123456",
    name: "Test Retailer",
    role: "retailer",
  },
];

async function createUser(entry: (typeof ROLES)[number]) {
  let uid: string;
  try {
    const cred = await createUserWithEmailAndPassword(
      auth,
      entry.email,
      entry.password
    );
    uid = cred.user.uid;
    console.log(`Created ${entry.role}: ${entry.email}`);
  } catch (err: any) {
    if (err.code === "auth/email-already-in-use") {
      const cred = await signInWithEmailAndPassword(
        auth,
        entry.email,
        entry.password
      );
      uid = cred.user.uid;
      console.log(`${entry.role} already exists, updating profile...`);
    } else {
      throw err;
    }
  }

  await setDoc(doc(db, "users", uid), {
    uid,
    email: entry.email,
    name: entry.name,
    role: entry.role,
    createdAt: new Date().toISOString(),
  });
  console.log(`Profile saved for ${entry.role}`);
}

async function seedRoles() {
  for (const entry of ROLES) {
    await createUser(entry);
  }
  console.log("\nAll role accounts created:");
  console.log("  Manager:  manager@largifybizdist.com  / 123456");
  console.log("  Salesman: salesman@largifybizdist.com / 123456");
  console.log("  Retailer: retailer@largifybizdist.com / 123456");
  process.exit(0);
}

seedRoles().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
