import { useState } from 'react';
import { Lightbulb, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRecommendations } from '@/hooks/use-recommendations';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { Recommendation } from '@shared/schema';

interface RecommendationPanelProps {
  selectedRegion: number;
  language: 'zh' | 'en';
  onAcceptRecommendation: (data: { title: string; suggestedDate: string }) => void;
}

interface RecommendationCardProps {
  recommendation: Recommendation;
  onAccept: (recommendation: Recommendation) => void;
  onReject: (id: number) => void;
  language: 'zh' | 'en';
}

function RecommendationCard({ recommendation, onAccept, onReject, language }: RecommendationCardProps) {
  const getConfidenceColor = (score: number) => {
    if (score >= 0.9) return 'bg-green-100 text-green-700';
    if (score >= 0.8) return 'bg-amber-100 text-amber-700';
    if (score >= 0.7) return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getBackgroundColor = (score: number) => {
    if (score >= 0.9) return 'bg-green-50 border-green-200';
    if (score >= 0.8) return 'bg-amber-50 border-amber-200';
    if (score >= 0.7) return 'bg-blue-50 border-blue-200';
    return 'bg-gray-50 border-gray-200';
  };

  const getButtonColor = (score: number) => {
    if (score >= 0.9) return 'bg-green-600 hover:bg-green-700';
    if (score >= 0.8) return 'bg-amber-600 hover:bg-amber-700';
    if (score >= 0.7) return 'bg-blue-600 hover:bg-blue-700';
    return 'bg-gray-600 hover:bg-gray-700';
  };

  const getTextColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600 hover:text-green-800';
    if (score >= 0.8) return 'text-amber-600 hover:text-amber-800';
    if (score >= 0.7) return 'text-blue-600 hover:text-blue-800';
    return 'text-gray-600 hover:text-gray-800';
  };

  return (
    <div className={`p-4 border rounded-lg ${getBackgroundColor(recommendation.confidenceScore)}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-4 h-4" />
          <span className="text-sm font-medium">{recommendation.title}</span>
        </div>
        <span className={`text-xs px-2 py-1 rounded ${getConfidenceColor(recommendation.confidenceScore)}`}>
          {Math.round(recommendation.confidenceScore * 100)}%
        </span>
      </div>
      <p className="text-xs mb-3">{recommendation.description}</p>
      <div className="flex space-x-2">
        <Button
          size="sm"
          onClick={() => onAccept(recommendation)}
          className={`text-xs text-white px-3 py-1 rounded ${getButtonColor(recommendation.confidenceScore)}`}
        >
          {language === 'zh' ? '接受' : 'Accept'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onReject(recommendation.id)}
          className={`text-xs ${getTextColor(recommendation.confidenceScore)}`}
        >
          {language === 'zh' ? '忽略' : 'Dismiss'}
        </Button>
      </div>
    </div>
  );
}

export default function RecommendationPanel({ selectedRegion, language, onAcceptRecommendation }: RecommendationPanelProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { recommendations, isLoading, refetch } = useRecommendations(selectedRegion, language);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: async () => {
      setIsGenerating(true);
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      
      const response = await apiRequest('POST', '/api/recommendations/generate', {
        regionId: selectedRegion,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        language: language,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recommendations'] });
      toast({
        title: language === 'zh' ? '推荐已生成' : 'Recommendations Generated',
        description: language === 'zh' ? '新的AI推荐已成功生成' : 'New AI recommendations have been generated successfully',
      });
    },
    onError: () => {
      toast({
        title: language === 'zh' ? '生成失败' : 'Generation Failed',
        description: language === 'zh' ? '生成推荐时出错，请重试' : 'Error generating recommendations, please try again',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      setIsGenerating(false);
    },
  });

  const acceptMutation = useMutation({
    mutationFn: async (id: number) => {
      // Now only marks the recommendation as accepted, without creating an event
      const response = await apiRequest('PUT', `/api/recommendations/${id}/accept`, { createEvent: false });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recommendations'] });
      // No longer need to invalidate events query here, as event is created via dialog
      toast({
        title: language === 'zh' ? '推荐已接受' : 'Recommendation Accepted',
        description: language === 'zh' ? '请在表单中完成事件创建' : 'Please complete event creation in the form.',
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('PUT', `/api/recommendations/${id}/reject`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recommendations'] });
      toast({
        title: language === 'zh' ? '推荐已忽略' : 'Recommendation Dismissed',
      });
    },
  });

  const handleAccept = (recommendation: Recommendation) => {
    onAcceptRecommendation({
      title: recommendation.title,
      suggestedDate: recommendation.suggestedDate,
    });
    acceptMutation.mutate(recommendation.id);
  };

  const handleReject = (id: number) => {
    rejectMutation.mutate(id);
  };

  const handleRefresh = () => {
    generateMutation.mutate();
  };

  const pendingRecommendations = recommendations.filter(rec => rec.status === 'pending');

  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">
          {language === 'zh' ? 'AI 推荐' : 'AI Recommendations'}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isGenerating}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-gray-50 border border-gray-200 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-3"></div>
              <div className="flex space-x-2">
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : pendingRecommendations.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-scroll">
          {pendingRecommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              onAccept={handleAccept}
              onReject={handleReject}
              language={language}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Lightbulb className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">
            {language === 'zh' ? '暂无推荐' : 'No recommendations'}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isGenerating}
            className="mt-2"
          >
            {isGenerating 
              ? (language === 'zh' ? '生成中...' : 'Generating...') 
              : (language === 'zh' ? '生成推荐' : 'Generate Recommendations')
            }
          </Button>
        </div>
      )}

      {pendingRecommendations.length > 0 && (
        <Button
          variant="outline"
          className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg py-2"
          onClick={() => refetch()}
        >
          {language === 'zh' ? '加载更多推荐' : 'Load More Recommendations'}
        </Button>
      )}
    </div>
  );
}
