import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import {
  initialDestinations,
  initialPackages,
  initialEnquiries,
  initialSiteSettings,
  initialReviews,
  initialServices,
  initialGallery,
} from "../src/lib/data/mockData";

const firebaseConfig = {
  apiKey: "AIzaSyB_OcRvxnzNtBhEcOGTfXQNk3lPfXjyzes",
  authDomain: "ai-gadget-suggestion.firebaseapp.com",
  projectId: "ai-gadget-suggestion",
  databaseURL: "https://ai-gadget-suggestion-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: "ai-gadget-suggestion.firebasestorage.app",
  messagingSenderId: "636231242982",
  appId: "1:636231242982:web:1c6f2a26e30e6e55c85727",
  measurementId: "G-HNKHQRSB04",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const rtdb = getDatabase(app);

async function seedData() {
  console.log("==================================================");
  console.log("YaadgarSafar -> Firebase Data Migration & Seeder");
  console.log("==================================================");

  // Authenticate admin
  try {
    console.log("1. Authenticating as admin (admin@yaadgarsafar.com)...");
    const cred = await signInWithEmailAndPassword(auth, "admin@yaadgarsafar.com", "admin123");
    console.log(`   Authenticated successfully (UID: ${cred.user.uid})`);
  } catch (err: any) {
    console.warn("   Admin login notice:", err?.message || err);
  }

  // Helper to seed a map of items
  const seedCollection = async (path: string, items: any[], getId: (item: any) => string) => {
    console.log(`\nPushing ${items.length} items to Firebase RTDB at /${path}...`);
    let successCount = 0;
    for (const item of items) {
      const id = getId(item);
      try {
        await set(ref(rtdb, `${path}/${id}`), item);
        successCount++;
      } catch (err: any) {
        throw err;
      }
    }
    console.log(`   Successfully uploaded ${successCount}/${items.length} items to /${path}`);
  };

  try {
    // 1. Site Settings
    console.log("\nUploading site settings to Firebase RTDB...");
    await set(ref(rtdb, "site_settings"), initialSiteSettings);
    console.log("   Site settings uploaded.");

    // 2. Destinations
    await seedCollection("destinations", initialDestinations, (d) => d.id);

    // 3. Tour Packages
    await seedCollection("packages", initialPackages, (p) => p.id);

    // 4. Enquiries & Bookings
    await seedCollection("enquiries", initialEnquiries, (e) => e.id);

    // 5. Customer Reviews
    await seedCollection("reviews", initialReviews, (r) => r.id);

    // 6. Services
    await seedCollection("services", initialServices, (s) => s.id);

    // 7. Gallery
    await seedCollection("gallery", initialGallery, (g) => g.id);

    console.log("\n==================================================");
    console.log("All website data has been synced to Firebase!");
    console.log("==================================================");
  } catch (err: any) {
    console.error("\nFirebase RTDB Upload Failed!");
    console.error("Reason:", err?.message || err);
    console.log("\n--------------------------------------------------");
    console.log("HOW TO ENABLE PERMISSION IN FIREBASE CONSOLE:");
    console.log("1. Go to: https://console.firebase.google.com/project/ai-gadget-suggestion/database");
    console.log("2. Click on the 'Rules' tab at the top.");
    console.log("3. Change the rules to:");
    console.log(
      JSON.stringify(
        {
          rules: {
            ".read": true,
            ".write": true,
          },
        },
        null,
        2
      )
    );
    console.log("4. Click 'Publish'.");
    console.log("5. Then run: npm run seed:firebase");
    console.log("--------------------------------------------------\n");
  }
}

seedData().then(() => process.exit(0));
