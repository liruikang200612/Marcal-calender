import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import type { Region } from '@shared/schema';

interface CalendarHeaderProps {
  currentDate: Date;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
  onGoToToday: () => void;
  selectedRegion: number;
  onRegionChange: (regionId: number) => void;
  currentLanguage: 'zh' | 'en';
  onLanguageChange: (language: 'zh' | 'en') => void;
  currentView: 'month' | 'list';
  onViewChange: (view: 'month' | 'list') => void;
}

export default function CalendarHeader({
  currentDate,
  onNavigateMonth,
  onGoToToday,
  selectedRegion,
  onRegionChange,
  currentLanguage,
  onLanguageChange,
  currentView,
  onViewChange,
}: CalendarHeaderProps) {
  const { data: regions = [] } = useQuery<Region[]>({
    queryKey: ['/api/regions'],
  });

  const monthYear = currentDate.toLocaleDateString(currentLanguage === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
  });

  const regionFlags: Record<string, string> = {
    'cn': '🇨🇳',
    'us': '🇺🇸',
    'uk': '🇬🇧',
    'jp': '🇯🇵',
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Calendar className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">MarCal</h1>
            <p className="text-sm text-gray-500">Marketing Calendar</p>
          </div>
        </div>

        {/* Navigation and Controls */}
        <div className="flex items-center space-x-6">
          {/* Month Navigation */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="text-gray-600" />
            </Button>
            <span className="text-lg font-medium text-gray-900 min-w-[120px] text-center">
              {monthYear}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="text-gray-600" />
            </Button>
          </div>

          {/* Region Selector */}
          <Select 
            value={selectedRegion.toString()} 
            onValueChange={(value) => onRegionChange(Number(value))}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region.id} value={region.id.toString()}>
                  {regionFlags[region.code] || '🌍'} {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Language Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={currentLanguage === 'zh' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onLanguageChange('zh')}
              className="px-3 py-1 rounded-md text-sm font-medium"
            >
              中文
            </Button>
            <Button
              variant={currentLanguage === 'en' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onLanguageChange('en')}
              className="px-3 py-1 rounded-md text-sm font-medium"
            >
              EN
            </Button>
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={currentView === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('month')}
              className="px-3 py-1 rounded-md text-sm font-medium"
            >
              <Calendar className="mr-1 h-4 w-4" />
              Month
            </Button>
            <Button
              variant={currentView === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('list')}
              className="px-3 py-1 rounded-md text-sm font-medium"
            >
              List
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}