import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

export const useFocus = () => {
  const [isFocused, setIsFocused] = useState(true)

  useFocusEffect(
      useCallback(() => {
      setIsFocused(true)
      // Perform any necessary logic when the component is focused
      // You can access the current value of the ref using isFocusedRef.current
      // For example, you can conditionally render certain content based on the focus status.
      return () => {
        setIsFocused(false)
        // Perform any necessary cleanup logic when the component loses focus
      };
    }, []));
  return isFocused
}