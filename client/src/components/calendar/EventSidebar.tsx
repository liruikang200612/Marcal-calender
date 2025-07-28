import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RecommendationPanel from './RecommendationPanel';
import { useDraggable } from '@dnd-kit/core';

interface EventSidebarProps {
  onEventCreate: () => void;
  selectedRegion: number;
  language: 'zh' | 'en';
}

interface EventTemplateProps {
  type: 'holiday' | 'marketing' | 'custom';
  title: string;
  description: string;
  color: string;
}

function EventTemplate({ type, title, description, color }: EventTemplateProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `template-${type}`,
    data: {
      type: 'template',
      template: type,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-3 border rounded-lg cursor-move hover:opacity-80 transition-all ${
        isDragging ? 'opacity-50' : ''
      } ${color}`}
    >
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${
          type === 'holiday' ? 'bg-red-500' : 
          type === 'marketing' ? 'bg-blue-500' : 'bg-green-500'
        }`}></div>
        <span className="text-sm font-medium">{title}</span>
      </div>
      <p className="text-xs mt-1">{description}</p>
    </div>
  );
}

export default function EventSidebar({ onEventCreate, selectedRegion, language, onAcceptRecommendation }: EventSidebarProps) {
  const templates = {
    zh: [
      {
        type: 'holiday' as const,
        title: '节假日事件',
        description: '国家节假日和纪念日',
        color: 'bg-red-50 border-red-200 text-red-800',
      },
      {
        type: 'marketing' as const,
        title: '营销活动',
        description: '产品发布和促销活动',
        color: 'bg-blue-50 border-blue-200 text-blue-800',
      },
      {
        type: 'custom' as const,
        title: '自定义事件',
        description: '个人事件和会议',
        color: 'bg-green-50 border-green-200 text-green-800',
      },
    ],
    en: [
      {
        type: 'holiday' as const,
        title: 'Holiday Event',
        description: 'National holidays and observances',
        color: 'bg-red-50 border-red-200 text-red-800',
      },
      {
        type: 'marketing' as const,
        title: 'Marketing Campaign',
        description: 'Product launches and promotions',
        color: 'bg-blue-50 border-blue-200 text-blue-800',
      },
      {
        type: 'custom' as const,
        title: 'Custom Event',
        description: 'Personal events and meetings',
        color: 'bg-green-50 border-green-200 text-green-800',
      },
    ],
  };

  const currentTemplates = templates[language];

  return (
    <aside className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
      {/* Quick Add Event */}
      <div className="mb-6">
        <Button 
          onClick={onEventCreate}
          className="w-full flex items-center justify-center space-x-2 bg-primary text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'zh' ? '添加事件' : 'Add Event'}</span>
        </Button>
      </div>

      {/* Event Templates */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          {language === 'zh' ? '事件模板' : 'Event Templates'}
        </h3>
        <div className="space-y-2">
          {currentTemplates.map((template) => (
            <EventTemplate
              key={template.type}
              type={template.type}
              title={template.title}
              description={template.description}
              color={template.color}
            />
          ))}
        </div>
      </div>

      {/* AI Recommendations Panel */}
      <RecommendationPanel 
        selectedRegion={selectedRegion}
        language={language}
        onAcceptRecommendation={onAcceptRecommendation}
      />
    </aside>
  );
}
