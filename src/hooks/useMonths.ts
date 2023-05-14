import {useFocusEffect} from "@react-navigation/native";
import {useCallback, useRef, useState} from "react";
import {fetchMonths} from "../api/realm";
import {MonthSchema} from "../config/realm";
import {getAvailableMonths, Month} from "../utils/util";

export function useMonths() {
  const [months, setMonths] = useState<MonthSchema[]>([]);
  const [availableMonths, setAvailableMonths] = useState<Month[]>([]);
  const [loading, setLoading] = useState(true);
  const prevMonths = useRef<MonthSchema[]>();
  const prevAvailableMonths = useRef<Month[]>();
  const loadMonths = async () => {
    const months2 = await fetchMonths();
    try {
      const months3 = months2.filter(m => m.isValid());
      const availableMonths = getAvailableMonths(months3);
      if (
        months3.length === prevMonths.current?.length &&
        availableMonths.length === prevAvailableMonths.current?.length
      ) {
        return;
      }
      setMonths(months3);
      setAvailableMonths(availableMonths);
      prevAvailableMonths.current = availableMonths;
      prevMonths.current = months3;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadMonths();
      return () => {};
    }, []),
  );
  return {months, loading, availableMonths};
}
