// Simplified lunar calendar functions
// In production, integrate with lunar-typescript library

const lunarNumerals = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
];

export function getLunarDate(gregorianDate: string): string {
  const date = new Date(gregorianDate);
  
  // This is a simplified implementation
  // For production, use proper lunar calendar library
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const lunarDay = Math.floor((dayOfYear % 355) % 29.5);
  
  return lunarNumerals[lunarDay] || '初一';
}

export function getLunarHolidays(year: number) {
  return [
    {
      name: '春节',
      gregorianDate: `${year}-02-01`, // Approximate
      lunarDate: '正月初一',
      type: 'major'
    },
    {
      name: '元宵节',
      gregorianDate: `${year}-02-15`,
      lunarDate: '正月十五',
      type: 'traditional'
    },
    {
      name: '清明节',
      gregorianDate: `${year}-04-05`,
      lunarDate: '三月初三',
      type: 'solar'
    },
    {
      name: '端午节',
      gregorianDate: `${year}-06-14`,
      lunarDate: '五月初五',
      type: 'traditional'
    },
    {
      name: '中秋节',
      gregorianDate: `${year}-09-17`,
      lunarDate: '八月十五',
      type: 'major'
    }
  ];
}
