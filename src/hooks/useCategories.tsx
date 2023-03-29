import { useState, useEffect } from "react";
import { fetchUniqueCategories } from "../api/realmAPI";

export function useCategories() {
    const [categories, setCategories] = useState<string[]>([])

  const loadCategories = async () => {
    const uniqueCategories = await fetchUniqueCategories();
    setCategories(uniqueCategories);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return categories
}