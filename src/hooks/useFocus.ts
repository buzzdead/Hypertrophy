import { useEffect, useLayoutEffect, useRef } from "react";

export const useFocus = () => {
    const isFocusedRef = useRef(false);

    useLayoutEffect(() => {
        isFocusedRef.current = true;
        // Perform any necessary logic when the component is focused
        // You can access the current value of the ref using isFocusedRef.current
        // For example, you can conditionally render certain content based on the focus status.
        return () => {
          isFocusedRef.current = false;
          // Perform any necessary cleanup logic when the component loses focus
        };
      }, []);
    return isFocusedRef
}