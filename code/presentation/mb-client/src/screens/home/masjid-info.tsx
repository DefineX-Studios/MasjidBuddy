/* eslint-disable max-lines-per-function */
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';

import { supabase } from '@/core/supabase';
import type { RouteProp } from '@/navigation/types';
import { Text, View } from '@/ui';

const MasjidInfo = () => {
  const { params } = useRoute<RouteProp<'MasjidInfo'>>();
  const selectedMasjidId = params.selectedMasjidId;

  const [masjidInfo, setMasjidInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMasjidDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data: masjidDetails, error: masjidError } = await supabase
          .from('masjid')
          .select('*')
          .eq('id', selectedMasjidId);

        if (masjidError) {
          throw new Error('Error fetching masjid details');
        }

        if (!masjidDetails || masjidDetails.length === 0) {
          throw new Error('Masjid details not found');
        }

        setMasjidInfo(masjidDetails[0]); // Wrap in array if needed
      } catch (error) {
        setError('Error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMasjidDetails();
  }, [selectedMasjidId]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <Text className="mb-5 text-xl font-bold text-green-500">
          Loading...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <Text className="mb-5 text-xl font-bold text-green-500">
          Error: {error}
        </Text>
      </View>
    );
  }

  if (!masjidInfo) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <Text className="mb-10 text-lg font-bold text-green-500">
          No masjid details found
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-gray-900 ">
      <Text className="mb-4 text-lg font-bold text-green-500">
        Name: {masjidInfo.name}
      </Text>
      <Text className="mb-4 text-lg font-bold text-green-500">
        Address: {masjidInfo.address.line1}, {masjidInfo.address.line2},{' '}
        {masjidInfo.address.pin}
      </Text>
      <Text className="mb-4 text-lg font-bold text-green-500">
        Mobile: {masjidInfo.mobile}
      </Text>
    </View>
  );
};

export default MasjidInfo;
