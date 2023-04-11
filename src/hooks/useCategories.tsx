import { useFocusEffect } from "@react-navigation/native";
import { useState, useEffect, useCallback } from "react";
import { fetchCategories } from "../api/realmAPI";
import { CategorySchema } from "../config/realmConfig";

export function useCategories() {
    const [categories, setCategories] = useState<CategorySchema[]>([])

  const loadCategories = async () => {
    const uniqueCategories = await fetchCategories();
    setCategories(uniqueCategories);
  };


  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [])
  );

  return categories
}