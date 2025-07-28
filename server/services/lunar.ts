interface LunarDate {
  year: number;
  month: number;
  day: number;
  monthName: string;
  dayName: string;
  isLeapMonth: boolean;
}

// Simplified lunar calendar conversion
// In production, you would use the lunar-typescript library or similar
export function getWeatherData(gregorianDate: string): LunarDate {
  const date = new Date(gregorianDate);
  
  // This is a simplified implementation
  // For production, integrate with lunar-typescript library
  const lunarMonths = [
    "正月", "二月", "三月", "四月", "五月", "六月",
    "七月", "八月", "九月", "十月", "十一月", "十二月"
  ];
  
  const lunarDays = [
    "初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十",
    "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
    "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"
  ];
  
  // Simplified conversion (not accurate - use proper library in production)
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const lunarMonth = Math.floor((dayOfYear % 355) / 29.5);
  const lunarDay = Math.floor((dayOfYear % 355) % 29.5);
  
  return {
    year: date.getFullYear(),
    month: lunarMonth + 1,
    day: lunarDay + 1,
    monthName: lunarMonths[lunarMonth] || "正月",
    dayName: lunarDays[lunarDay] || "初一",
    isLeapMonth: false
  };
}

export function getLunarHolidays(year: number): Array<{
  name: string;
  date: string;
  lunarDate: string;
  description: string;
}> {
  return [
    {
      name: "春节",
      date: `${year}-02-01`, // Approximate - should calculate actual date
      lunarDate: "正月初一",
      description: "农历新年"
    },
    {
      name: "元宵节",
      date: `${year}-02-15`,
      lunarDate: "正月十五",
      description: "正月十五元宵节"
    },
    {
      name: "中秋节",
      date: `${year}-09-15`,
      lunarDate: "八月十五",
      description: "八月十五中秋节"
    }
  ];
}
