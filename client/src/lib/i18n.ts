export const translations = {
  zh: {
    // App
    appTitle: 'MarCal',
    appSubtitle: '营销日历',
    
    // Navigation
    today: '今天',
    month: '月',
    list: '列表',
    
    // Events
    addEvent: '添加事件',
    createEvent: '创建事件',
    editEvent: '编辑事件',
    eventTitle: '事件标题',
    eventType: '事件类型',
    startDate: '开始日期',
    endDate: '结束日期',
    description: '描述',
    
    // Event Types
    holiday: '节假日',
    marketing: '营销活动',
    custom: '自定义事件',
    
    // Filters
    show: '显示',
    holidays: '节假日',
    
    // AI Recommendations
    aiRecommendations: 'AI 推荐',
    accept: '接受',
    reject: '拒绝',
    dismiss: '忽略',
    generateRecommendations: '生成推荐',
    
    // Messages
    eventCreated: '事件已创建',
    eventDeleted: '事件已删除',
    eventCreateSuccess: '事件创建成功',
    eventUpdateSuccess: '事件更新成功',
    eventDeleteSuccess: '事件删除成功',
    recommendationAccepted: '推荐已接受',
    recommendationRejected: '推荐已拒绝',
    
    // Form
    save: '保存',
    cancel: '取消',
    delete: '删除',
    loading: '加载中...',
    
    // Calendar
    weekDays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  },
  
  en: {
    // App
    appTitle: 'MarCal',
    appSubtitle: 'Marketing Calendar',
    
    // Navigation
    today: 'Today',
    month: 'Month',
    list: 'List',
    
    // Events
    addEvent: 'Add Event',
    createEvent: 'Create Event',
    editEvent: 'Edit Event',
    eventTitle: 'Event Title',
    eventType: 'Event Type',
    startDate: 'Start Date',
    endDate: 'End Date',
    description: 'Description',
    
    // Event Types
    holiday: 'Holiday',
    marketing: 'Marketing Campaign',
    custom: 'Custom Event',
    
    // Filters
    show: 'Show',
    holidays: 'Holidays',
    
    // AI Recommendations
    aiRecommendations: 'AI Recommendations',
    accept: 'Accept',
    reject: 'Reject',
    dismiss: 'Dismiss',
    generateRecommendations: 'Generate Recommendations',
    
    // Messages
    eventCreated: 'Event Created',
    eventDeleted: 'Event Deleted',
    eventCreateSuccess: 'Event created successfully',
    eventUpdateSuccess: 'Event updated successfully',
    eventDeleteSuccess: 'Event deleted successfully',
    recommendationAccepted: 'Recommendation Accepted',
    recommendationRejected: 'Recommendation Rejected',
    
    // Form
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    loading: 'Loading...',
    
    // Calendar
    weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;

export function t(key: TranslationKey, language: Language): string {
  return translations[language][key] || translations.en[key] || key;
}
