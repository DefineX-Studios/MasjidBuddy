import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/core/supabase';

export const useMasjids = () => {
  return useQuery({
    queryKey: ['masjids'],
    queryFn: async () => {
      const result = await supabase.from('masjid').select('*');
      const { data, error: _err } = result;
      return data;
    },
  });
};
