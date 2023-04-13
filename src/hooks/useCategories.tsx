import { useFocusEffect } from "@react-navigation/native";
import { useState, useCallback } from "react";
import { fetchCategories } from "../api/realmAPI";
import { CategorySchema } from "../config/realmConfig";


export function useCategories() {
  const [categories, setCategories] = useState<CategorySchema[]>([])
  const [loading, setLoading] = useState(true)

  const loadCategories = async () => {
    const uniqueCategories = await fetchCategories();
    const validCategories = uniqueCategories.filter((cat) => cat.isValid());
    setCategories(validCategories);
    setLoading(false)
  };

  const refresh = async () => {
    setLoading(true)
    await loadCategories()
    setLoading(false)
  }

  useFocusEffect(
    useCallback(() => {
      setLoading(true)
      loadCategories();
    }, [])
  );

  return {categories, refresh, loading};
}
