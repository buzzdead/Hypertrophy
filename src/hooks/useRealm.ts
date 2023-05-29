import {useMutation, useQuery, useQueryClient} from "react-query";
import {Schema} from "../../typings/types";
import {RealmWrapper} from "../api/RealmWrapper";
import {validateSchema} from "../utils/util";

interface UseRealmConfig<T> {
  schemaName: keyof Schema;
  limitBy?: {by: "Month"; when: number};
  mutateFunction?: (item: T, action: Mutations) => Promise<void | boolean>;
}

export type Mutations = "ADD" | "SAVE" | "DEL";

export function useRealm<T extends Schema[keyof Schema]>({schemaName, limitBy, mutateFunction}: UseRealmConfig<T>) {
  const rw = new RealmWrapper();

  const queryClient = useQueryClient();

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
      onSettled: async (newMonthAdded, error, newItem, context) => {
        await queryClient.invalidateQueries(schemaName);
        if(newMonthAdded) await queryClient.invalidateQueries("Month");
      },
    },
  );

  const fetchData = async () => {
    if(schemaName === undefined) return
    const dataArray = limitBy
      ? await rw.getRealmObject<T>(schemaName, limitBy)
      : await rw.getRealmObject<T>(schemaName);
    return dataArray;
  };

  const {
    data,
    isLoading: loading,
    refetch: refresh,
  } = useQuery([schemaName, limitBy], fetchData, {
    cacheTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  return {data: data === undefined ? [] : data, loading, refresh, mutateItem};
}
