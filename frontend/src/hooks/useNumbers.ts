import { useState, useEffect, useCallback } from 'react';
import { getNumbers, getCountries } from '../lib/api';

export const useNumbers = (country?: string) => {
  const [numbers, setNumbers] = useState<unknown[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit: 20 };
      if (country) params.country = country;
      const data = await getNumbers(params);
      setNumbers(data.numbers);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [country, page]);

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => { getCountries().then(setCountries); }, []);

  return { numbers, countries, loading, total, page, setPage, refetch: fetch };
};
