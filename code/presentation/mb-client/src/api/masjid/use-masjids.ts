import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/core/supabase';

export const useMasjids = () => {
  return useQuery({
    queryKey: ['masjids'],
    queryFn: async () => {
      const result = await supabase.rpc('get_masjids_with_namaz_timings');
      console.log(`result: ${JSON.stringify(result)}`);
      const { data, error: _err } = result;
      return data;
    },
  });
};
