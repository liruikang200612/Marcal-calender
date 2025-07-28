import OpenAI from "openai";
import type { Event, Holiday, InsertRecommendation } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

interface GenerateRecommendationsParams {
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
  1: { name: 'China', culture: 'Chinese Super League, National Team, Asian Cup, World Cup enthusiasm', popularTeams: 'Guangzhou Evergrande, Shanghai SIPG, Beijing Guoan' },
  2: { name: 'United States', culture: 'MLS, World Cup, European Big 5 Leagues attention', popularTeams: 'LAFC, Seattle Sounders, Atlanta United' },
  3: { name: 'Canada', culture: 'MLS, World Cup, European Leagues', popularTeams: 'Toronto FC, Vancouver Whitecaps, CF Montreal' },
  4: { name: 'Europe', culture: 'Big 5 Leagues, Champions League, European Championship, World Cup', popularTeams: 'Real Madrid, Barcelona, Manchester United, Bayern Munich, PSG' },
  5: { name: 'Japan', culture: 'J-League, Asian Cup, World Cup, European League attention', popularTeams: 'Urawa Red Diamonds, Kashima Antlers, Kawasaki Frontale' },
  6: { name: 'South Korea', culture: 'K-League, Asian Cup, World Cup, European Leagues', popularTeams: 'Jeonbuk Hyundai, Ulsan Hyundai, FC Seoul' },
  7: { name: 'Vietnam', culture: 'V-League, Southeast Asian Football, World Cup, European Leagues', popularTeams: 'Hanoi FC, Ho Chi Minh City FC, Binh Duong FC' },
  8: { name: 'Indonesia', culture: 'Indonesian Super League, Southeast Asian Football, World Cup', popularTeams: 'Persija Jakarta, Bali United, Arema FC' },
  9: { name: 'Thailand', culture: 'Thai League, Southeast Asian Football, World Cup', popularTeams: 'Buriram United, Bangkok United, Chonburi FC' },
  10: { name: 'Brazil', culture: 'Brasileirão, Copa Libertadores, World Cup football kingdom', popularTeams: 'Flamengo, Corinthians, Palmeiras' },
  11: { name: 'Argentina', culture: 'Argentine Primera División, South American Football, World Cup, Messi culture', popularTeams: 'Boca Juniors, River Plate, Racing Club' },
  12: { name: 'Mexico', culture: 'Liga MX, CONCACAF Football, World Cup', popularTeams: 'Club América, Guadalajara, Cruz Azul' }
};

export async function generateRecommendations(params: GenerateRecommendationsParams): Promise<InsertRecommendation[]> {
  const { regionId, startDate, endDate, existingEvents, holidays } = params;
  const regionInfo = regionFootballCulture[regionId as keyof typeof regionFootballCulture] || { name: 'Unknown Region', culture: 'Football culture', popularTeams: 'Local teams' };

  const prompt = `
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
    Time Period: ${startDate} to ${endDate}
    
    Existing Events:
    ${existingEvents.map(e => `- ${e.title} on ${e.startDate} (${e.description || 'No description'})`).join('\n')}
    
    Holidays during this period:
    ${holidays.map(h => `- ${h.name} on ${h.date} (${h.description || 'No description'})`).join('\n')}

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

    Respond with valid JSON in this exact format:
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
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional marketing expert for Winner12 football prediction product. Specializing in creating precise marketing strategies for football enthusiasts and sports betting users, generating high-conversion marketing recommendations based on football culture and match rhythms."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"recommendations": []}');
    
    return result.recommendations.map((rec: AIRecommendation): InsertRecommendation => ({
      title: rec.title,
      description: rec.description,
      suggestedDate: rec.suggestedDate,
      confidenceScore: Math.max(0.7, Math.min(1.0, rec.confidenceScore)),
      status: "pending",
      regionId,
      eventTypeId: rec.eventTypeId,
      reasoning: rec.reasoning
    }));

  } catch (error) {
    console.error('OpenAI API error:', error);
    // Return fallback recommendations if OpenAI fails
    return [
      {
        title: `Winner12 ${regionInfo.name} Football Prediction Campaign`,
        description: `Specialized Winner12 AI prediction product promotion targeting ${regionInfo.name} football enthusiasts, combining local football culture to enhance user awareness and adoption of AI football prediction`,
        suggestedDate: endDate,
        confidenceScore: 0.8,
        status: "pending",
        regionId,
        eventTypeId: 2,
        reasoning: `${regionInfo.name} region has a strong football culture atmosphere, Winner12's AI prediction features can meet local football fans' needs for match analysis, making it an ideal product promotion opportunity`
      }
    ];
  }
}

export async function analyzeEventSentiment(eventDescription: string): Promise<{
  sentiment: number;
  confidence: number;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Analyze the sentiment of marketing events. Respond with JSON containing sentiment (1-5 scale) and confidence (0-1)."
        },
        {
          role: "user",
          content: `Analyze the sentiment of this marketing event: "${eventDescription}"`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{"sentiment": 3, "confidence": 0.5}');
    
    return {
      sentiment: Math.max(1, Math.min(5, Math.round(result.sentiment))),
      confidence: Math.max(0, Math.min(1, result.confidence)),
    };
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return { sentiment: 3, confidence: 0.5 };
  }
}