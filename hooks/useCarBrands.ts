import { useEffect, useState } from "react";
import { initDB } from "@/lib/db";

export const useCarBrands = () => {
  const [brands, setBrands] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    initDB()
      .then((db) => db.getAll("cars"))
      .then((data) => {
        const unique = Array.from(new Set(data.map((i) => i.brand)));
        setBrands(unique.map((b) => ({ value: b, label: b })));
      })
      .catch(console.error);
  }, []);

  return brands;
};
