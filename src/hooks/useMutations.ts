import { useQueryClient, useMutation } from "react-query";
import { Schema } from "../../typings/types";

export type Mutations = "ADD" | "SAVE" | "DEL";

export function useMutations<T extends Schema[keyof Schema]>(
    schemaName: keyof Schema, 
    mutateFunction?: (item: T, action: Mutations) => Promise<void>
  ) {
    const queryClient = useQueryClient()
  
    const mutateItem = useMutation(
        // This function now returns a Promise
        ({item, action}: {item: T; action: Mutations}) => {
          if (!mutateFunction) {
            throw new Error("No mutate function provided");
          }
          // Call onMutate and return the Promise it produces
          return mutateFunction(item, action);
        },
        {
          onMutate: async ({item: newItem, action}) => {
            await queryClient.cancelQueries(schemaName);
            const previousItems = queryClient.getQueryData<T[]>(schemaName);
            if (previousItems) {
              action === "DEL"
                ? queryClient.setQueryData<T[]>(schemaName, {...previousItems.filter(p => p.id !== newItem.id)})
                : queryClient.setQueryData<T[]>(schemaName, [...previousItems, newItem]);
            }
            return () => (previousItems ? queryClient.setQueryData(schemaName, previousItems) : null);
          },
          onError: (error, newItem, rollback) => {
            console.error(error);
            if (rollback) rollback();
          },
          onSettled: async () => {
            await queryClient.invalidateQueries(schemaName);
          },
        },
      );
  
    return { mutateItem };
  }