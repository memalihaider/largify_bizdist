// Run once: npx tsx scripts/seed-admin.ts
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

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

const ADMIN_EMAIL = "admin@largifybizdist.com";
const ADMIN_PASSWORD = "123456";

async function seedAdmin() {
  try {
    // Try creating the user
    let uid: string;
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        ADMIN_EMAIL,
        ADMIN_PASSWORD
      );
      uid = cred.user.uid;
      console.log("Admin user created in Firebase Auth");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        // Already exists — sign in to get uid
        const cred = await signInWithEmailAndPassword(
          auth,
          ADMIN_EMAIL,
          ADMIN_PASSWORD
        );
        uid = cred.user.uid;
        console.log("Admin user already exists, updating profile...");
      } else {
        throw err;
      }
    }

    // Write / overwrite the admin profile in Firestore
    await setDoc(doc(db, "users", uid), {
      uid,
      email: ADMIN_EMAIL,
      name: "Admin",
      role: "admin",
      createdAt: new Date().toISOString(),
    });

    console.log("Admin profile saved to Firestore");
    console.log(`\nEmail:    ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log(`Role:     admin`);
    console.log("\nDone! You can now sign in.");
    process.exit(0);
  } catch (err) {
    console.error("Failed to seed admin:", err);
    process.exit(1);
  }
}

seedAdmin();
