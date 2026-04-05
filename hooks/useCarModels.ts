import { useEffect, useState } from "react";
import { initDB } from "@/lib/db";

export const useCarModels = (selectedMake: string) => {
  const [models, setModels] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    if (!selectedMake) {
      setModels([]);
      return;
    }

    initDB()
      .then((db) => db.get("cars", selectedMake))
      .then((data) => {
        if (!data?.models) return setModels([]);
        const unique = Array.from(new Set(data.models)) as string[];
        setModels(unique.map((m) => ({ value: m, label: m })));
      })
      .catch(console.error);
  }, [selectedMake]);

  return models;
};
