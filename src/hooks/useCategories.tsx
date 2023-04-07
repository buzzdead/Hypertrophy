import { useState, useEffect } from "react";
import { fetchCategories } from "../api/realmAPI";
import { CategorySchema } from "../config/realmConfig";

export function useCategories() {
    const [categories, setCategories] = useState<CategorySchema[]>([])

  const loadCategories = async () => {
    const uniqueCategories = await fetchCategories();
    setCategories(uniqueCategories);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return categories
}