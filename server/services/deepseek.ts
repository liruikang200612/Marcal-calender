import type { Event, Holiday, InsertRecommendation } from "@shared/schema";
import OpenAI from "openai";

const deepseek = new OpenAI({
  baseURL: "https://api.aihubmix.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || 'sk-5TLjMukdVTDBGibBDc2bE478EfD44d8e9089D06914D84916'
});

interface GenerateRecommendationsParams {
  language: 'zh' | 'en';
  regionId: number;
  startDate: string;
  endDate: string;
  existingEvents: Event[];
  holidays: Holiday[];
}

interface AIRecommendation {
  title: string;
  description: string;
  suggestedDate: string;
  confidenceScore: number;
  reasoning: string;
  eventTypeId: number; // 1: holiday, 2: marketing, 3: custom
}

// 区域映射表，用于识别不同区域的足球文化特色
const regionFootballCulture = {
  1: { name: '中国', culture: '中超联赛、国足、亚洲杯、世界杯热情', popularTeams: '广州恒大、上海上港、北京国安' },
  2: { name: '美国', culture: 'MLS、世界杯、欧洲五大联赛关注', popularTeams: 'LAFC、西雅图海湾人、亚特兰大联' },
  3: { name: '加拿大', culture: 'MLS、世界杯、欧洲联赛', popularTeams: '多伦多FC、温哥华白帽、蒙特利尔冲击' },
  4: { name: '欧洲', culture: '五大联赛、欧冠、欧洲杯、世界杯', popularTeams: '皇马、巴萨、曼联、拜仁、巴黎' },
  5: { name: '日本', culture: 'J联赛、亚洲杯、世界杯、欧洲联赛关注', popularTeams: '浦和红钻、鹿岛鹿角、川崎前锋' },
  6: { name: '韩国', culture: 'K联赛、亚洲杯、世界杯、欧洲联赛', popularTeams: '全北现代、蔚山现代、首尔FC' },
  7: { name: '越南', culture: 'V联赛、东南亚足球、世界杯、欧洲联赛', popularTeams: '河内FC、胡志明市FC、平阳FC' },
  8: { name: '印度尼西亚', culture: '印尼超级联赛、东南亚足球、世界杯', popularTeams: '佩尔西亚雅加达、巴厘联、阿雷马FC' },
  9: { name: '泰国', culture: '泰超联赛、东南亚足球、世界杯', popularTeams: '武里南联、曼谷联合、春武里FC' },
  10: { name: '巴西', culture: '巴甲联赛、南美解放者杯、世界杯足球王国', popularTeams: '弗拉门戈、科林蒂安、帕尔梅拉斯' },
  11: { name: '阿根廷', culture: '阿甲联赛、南美足球、世界杯、梅西文化', popularTeams: '博卡青年、河床、竞技俱乐部' },
  12: { name: '墨西哥', culture: '墨超联赛、中北美足球、世界杯', popularTeams: '美洲队、瓜达拉哈拉、蓝十字' }
};

const prompts = {
  zh: (params: Omit<GenerateRecommendationsParams, 'language'>) => {
    const regionInfo = regionFootballCulture[params.regionId as keyof typeof regionFootballCulture] || { name: '未知区域', culture: '足球文化', popularTeams: '本地球队' };
    
    return `
    你是Winner12足球预测产品的专业营销推广人员。Winner12是一款使用AI技术进行足球比赛预测的创新产品，帮助用户提高足球投注和预测的准确性。

    ## 产品背景
    - 产品名称：Winner12 AI足球预测
    - 核心功能：AI驱动的足球比赛结果预测
    - 目标用户：足球爱好者、体育投注者、数据分析师
    - 竞争优势：高精度预测算法、实时数据分析、用户友好界面

    ## 目标区域分析
    推广区域：${regionInfo.name}
    足球文化特色：${regionInfo.culture}
    热门球队：${regionInfo.popularTeams}

    ## 营销日历数据
    时间段: ${params.startDate} 到 ${params.endDate}
    
    现有事件:
    ${params.existingEvents.map(e => `- ${e.title} 在 ${e.startDate} (${e.description || '无描述'})`).join('\n')}
    
    此期间的节假日:
    ${params.holidays.map(h => `- ${h.name} 在 ${h.date} (${h.description || '无描述'})`).join('\n')}

    ## 营销推荐策略要求
    请基于Winner12足球预测产品特性，为${regionInfo.name}地区生成3-5个高转化率的足球相关营销节日推荐：

    ### 优先推荐类型：
    1. **重大足球赛事期间** - 世界杯、欧洲杯、美洲杯、亚洲杯等国际大赛
    2. **联赛关键节点** - 赛季开始、转会窗口、季后赛、总决赛
    3. **本地足球文化节日** - 当地球队成立纪念日、重要比赛纪念日
    4. **足球相关国际日** - 世界足球日、反种族主义日等
    5. **体育博彩热点时期** - 重要比赛前后、赔率波动期

    ### 营销角度建议：
    - 强调AI预测的准确性和科技感
    - 结合当地足球文化和热门球队
    - 突出产品在重要比赛中的价值
    - 利用足球情感营销和社区归属感
    - 展示数据分析的专业性和可靠性

    ### 避免推荐：
    - 与足球无关的普通节日
    - 可能引起争议的敏感话题
    - 与现有事件冲突的时间点
    - 缺乏商业转化价值的纪念日

    ## 输出要求
    对于每个推荐，请提供：
    - title: 吸引足球爱好者的营销活动名称
    - description: 详细的Winner12产品推广策略，包括目标用户、营销卖点、预期效果
    - suggestedDate: YYYY-MM-DD格式的最佳营销时机
    - confidenceScore: 0.7-1.0之间的推荐信心度（基于足球相关性和商业价值）
    - reasoning: 详细说明为什么这个时机适合推广Winner12，包括足球背景、用户需求、竞争优势
    - eventTypeId: 2表示营销活动

    请严格按照以下JSON格式回复：
    {
      "recommendations": [
        {
          "title": "Winner12足球预测营销活动标题",
          "description": "针对足球爱好者的详细推广策略",
          "suggestedDate": "YYYY-MM-DD",
          "confidenceScore": 0.85,
          "reasoning": "基于足球文化和Winner12产品特性的推荐理由",
          "eventTypeId": 2
        }
      ]
    }
  `},
  en: (params: Omit<GenerateRecommendationsParams, 'language'>) => {
    const regionInfo = regionFootballCulture[params.regionId as keyof typeof regionFootballCulture] || { name: 'Unknown Region', culture: 'Football culture', popularTeams: 'Local teams' };
    
    return `
    You are a professional marketing specialist for Winner12, an AI-powered football match prediction product. Winner12 uses advanced AI technology to help users improve their football betting and prediction accuracy.

    ## Product Background
    - Product Name: Winner12 AI Football Prediction
    - Core Function: AI-driven football match result prediction
    - Target Users: Football enthusiasts, sports bettors, data analysts
    - Competitive Advantage: High-precision prediction algorithms, real-time data analysis, user-friendly interface

    ## Target Region Analysis
    Marketing Region: ${regionInfo.name}
    Football Culture: ${regionInfo.culture}
    Popular Teams: ${regionInfo.popularTeams}

    ## Marketing Calendar Data
    Time Period: ${params.startDate} to ${params.endDate}
    
    Existing Events:
    ${params.existingEvents.map(e => `- ${e.title} on ${e.startDate} (${e.description || 'No description'})`).join('\n')}
    
    Holidays during this period:
    ${params.holidays.map(h => `- ${h.name} on ${h.date} (${h.description || 'No description'})`).join('\n')}

    ## Marketing Strategy Requirements
    Based on Winner12's football prediction product features, generate 3-5 high-conversion football-related marketing holiday recommendations for ${regionInfo.name}:

    ### Priority Recommendation Types:
    1. **Major Football Events** - World Cup, European Championship, Copa America, Asian Cup, etc.
    2. **League Key Moments** - Season start, transfer windows, playoffs, finals
    3. **Local Football Culture Days** - Local team anniversaries, important match commemorations
    4. **Football-related International Days** - World Football Day, Anti-Racism Day, etc.
    5. **Sports Betting Hot Periods** - Before/after important matches, odds fluctuation periods

    ### Marketing Angle Suggestions:
    - Emphasize AI prediction accuracy and technology
    - Combine local football culture and popular teams
    - Highlight product value during important matches
    - Use football emotional marketing and community belonging
    - Showcase data analysis professionalism and reliability

    ### Avoid Recommending:
    - Non-football related ordinary holidays
    - Potentially controversial sensitive topics
    - Time conflicts with existing events
    - Commemorative days lacking commercial conversion value

    ## Output Requirements
    For each recommendation, provide:
    - title: Marketing activity name that attracts football enthusiasts
    - description: Detailed Winner12 product promotion strategy, including target users, marketing selling points, expected results
    - suggestedDate: Optimal marketing timing in YYYY-MM-DD format
    - confidenceScore: Recommendation confidence between 0.7-1.0 (based on football relevance and commercial value)
    - reasoning: Detailed explanation of why this timing suits Winner12 promotion, including football background, user needs, competitive advantages
    - eventTypeId: 2 for marketing campaigns

    Please respond strictly in the following JSON format:
    {
      "recommendations": [
        {
          "title": "Winner12 Football Prediction Marketing Campaign Title",
          "description": "Detailed promotion strategy targeting football enthusiasts",
          "suggestedDate": "YYYY-MM-DD",
          "confidenceScore": 0.85,
          "reasoning": "Recommendation reason based on football culture and Winner12 product features",
          "eventTypeId": 2
        }
      ]
    }
  `}
};

export async function generateRecommendations(params: GenerateRecommendationsParams): Promise<InsertRecommendation[]> {
  const { language, ...restParams } = params;
  const prompt = prompts[language](restParams);
  
  try {
    const response = await deepseek.chat.completions.create({
      model: "DeepSeek-V3-Fast",
      messages: [
        {
          role: "system",
          content: language === 'zh' 
            ? "你是Winner12足球预测产品的专业营销推广专家。专门为足球爱好者和体育投注用户制定精准的营销策略，基于足球文化和赛事节奏生成高转化率的营销推荐。"
            : "You are a professional marketing expert for Winner12 football prediction product. Specializing in creating precise marketing strategies for football enthusiasts and sports betting users, generating high-conversion marketing recommendations based on football culture and match rhythms."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    let content = response.choices[0].message.content || '{"recommendations": []}';
    // Remove markdown backticks if they exist
    content = content.replace(/```json\n|\n```/g, '').trim();
    const result = JSON.parse(content);
    
    return result.recommendations.map((rec: AIRecommendation): InsertRecommendation => ({
      title: rec.title,
      description: rec.description,
      suggestedDate: rec.suggestedDate,
      confidenceScore: Math.max(0.7, Math.min(1.0, rec.confidenceScore)),
      status: "pending",
      regionId: params.regionId,
      eventTypeId: rec.eventTypeId,
      reasoning: rec.reasoning
    }));

  } catch (error) {
    console.error('DeepSeek API error:', error);
    const regionInfo = regionFootballCulture[params.regionId as keyof typeof regionFootballCulture] || { name: '目标区域', culture: '足球文化', popularTeams: '本地球队' };
    
    if (language === 'zh') {
      return [{
        title: `Winner12 ${regionInfo.name}足球预测推广活动`,
        description: `针对${regionInfo.name}足球爱好者的Winner12 AI预测产品专项推广，结合当地足球文化特色，提升用户对AI足球预测的认知和使用率`,
        suggestedDate: params.endDate,
        confidenceScore: 0.8,
        status: "pending",
        regionId: params.regionId,
        eventTypeId: 2,
        reasoning: `${regionInfo.name}地区具有浓厚的足球文化氛围，Winner12的AI预测功能能够满足当地足球爱好者对比赛分析的需求，是理想的产品推广时机`
      }];
    } else {
      return [{
        title: `Winner12 ${regionInfo.name} Football Prediction Campaign`,
        description: `Specialized Winner12 AI prediction product promotion targeting ${regionInfo.name} football enthusiasts, combining local football culture to enhance user awareness and adoption of AI football prediction`,
        suggestedDate: params.endDate,
        confidenceScore: 0.8,
        status: "pending",
        regionId: params.regionId,
        eventTypeId: 2,
        reasoning: `${regionInfo.name} region has a strong football culture atmosphere, Winner12's AI prediction features can meet local football fans' needs for match analysis, making it an ideal product promotion opportunity`
      }];
    }
  }
}