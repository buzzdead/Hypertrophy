import { useLayoutEffect, useState } from "react";
import { fetchMonths } from "../api/realmAPI";
import { MonthSchema } from "../config/realmConfig";
import { getAvailableMonths, Month } from "../utils/util";

export function useMonths() {
    const [months, setMonths] = useState<MonthSchema[]>([])
    const [availableMonths, setAvailableMonths] = useState<Month[]>([])
    const [loading, setLoading] = useState(true)
    const loadMonths = async () => {
        const months2 = await fetchMonths()
        try {
          if(months2.length === 0) return
          const availableMonths = getAvailableMonths(months2);
          setMonths(months2)
          setAvailableMonths(availableMonths)
        } catch (error) {
          console.log(error);
        }
        setLoading(false)
      }
    
      useLayoutEffect(() => {
        !loading && setLoading(true)
        loadMonths()
      }, [])
      return {months, loading, availableMonths}
}