import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

export const useFocus = () => {
  const [isFocused, setIsFocused] = useState(false)

  useFocusEffect(
      useCallback(() => {
      console.log("focusing")
      setIsFocused(true)
      // Perform any necessary logic when the component is focused
      // You can access the current value of the ref using isFocusedRef.current
      // For example, you can conditionally render certain content based on the focus status.
      return () => {
        console.log("unfocusing")
        setIsFocused(false)
        // Perform any necessary cleanup logic when the component loses focus
      };
    }, []));
  return isFocused
}