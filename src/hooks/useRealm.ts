import { useQuery } from 'react-query';
import { Schema } from '../../typings/types';
import { RealmWrapper } from '../api/RealmWrapper';
import { validateSchema } from '../utils/util';

interface UseRealmConfig<T> {
    schemaName: keyof Schema;
    limitBy?: { by: 'Month', when: number };
}

export function useRealm<T extends Schema[keyof Schema]>(schemaName: keyof Schema, limitBy?: { by: 'Month', when: number }) {
  const rw = new RealmWrapper();

  const fetchData = async () => {
    console.log("loading data" + schemaName)
    const dataArray = limitBy ? await rw.getRealmObject<T>(schemaName, limitBy) : await rw.getRealmObject<T>(schemaName);
    const validData = validateSchema(dataArray);
    return validData;
  };

  const { data, isLoading: loading, refetch: refresh } = useQuery([schemaName, limitBy], fetchData, {cacheTime: 1000 * 60 * 60, staleTime: 1000 * 60 * 60 , refetchOnWindowFocus: false});

  return { data: data === undefined ? [] : data, loading, refresh };
}
