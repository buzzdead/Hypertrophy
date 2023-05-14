import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Schema } from '../../typings/types';
import { RealmWrapper } from '../api/RealmWrapper';
import { validateSchema } from '../utils/util';

interface UseRealmConfig<T> {
    schemaName: keyof Schema;
    limitBy?: { by: 'Month', when: number };
  }

export function useRealm<T extends Schema[keyof Schema]>(schemaName: keyof Schema, limitBy?: { by: 'Month', when: number }) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const rw = new RealmWrapper();

  const loadData = async () => {
    console.log("loading data" + schemaName)
    const dataArray = limitBy ? await rw.getRealmObject<T>(schemaName, limitBy) : await rw.getRealmObject<T>(schemaName);
    const validData = validateSchema(dataArray);
    setData(validData);
    setLoading(false);
  };

  const refresh = async () => {
    setLoading(true);
    await loadData();
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadData();
      return () => {};
    }, []),
  );

  return { data, loading, refresh };
}
