import { useQuery } from '@tanstack/react-query';
import type { Recommendation } from '@shared/schema';

import { Language } from '@/lib/i18n';

export function useRecommendations(regionId: number, language: Language, status: string = 'pending') {
  const { data: recommendations = [], isLoading, refetch } = useQuery<Recommendation[]>({
    queryKey: ['/api/recommendations', { regionId, language, status }],
    queryFn: async () => {
      const params = new URLSearchParams({
        language,
        regionId: regionId.toString(),
        status,
      });
      const response = await fetch(`/api/recommendations?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      return response.json();
    },
  });

  return {
    recommendations,
    isLoading,
    refetch,
  };
}
