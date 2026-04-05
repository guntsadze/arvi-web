import { openDB } from "idb";
import carData from "@/constants/car.json";

export const initDB = async () => {
  const db = await openDB("CarDatabase", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("cars")) {
        db.createObjectStore("cars", { keyPath: "brand" });
      }
    },
  });

  // პირველი გაშვება: ავტომატურად seed
  const count = await db.count("cars");
  if (count === 0) {
    const tx = db.transaction("cars", "readwrite");
    for (const item of carData) {
      await tx.store.put(item);
    }
    await tx.done;
  }

  return db;
};
