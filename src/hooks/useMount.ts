import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";

export const useMount = () => {
    const [isMounted, setIsMounted] = useState(false)

    useFocusEffect(
        useCallback(() => {
        setTimeout(() => setIsMounted(true), 1)
        // Perform any necessary logic when the component is focused
        // You can access the current value of the ref using isFocusedRef.current
        // For example, you can conditionally render certain content based on the focus status.
        return () => {
          setIsMounted(false)
          // Perform any necessary cleanup logic when the component loses focus
        };
      }, []));
    return isMounted
}