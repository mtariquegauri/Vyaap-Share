import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface WhatsAppMessageRequest {
  shopType: string;
  occasion?: string;
  language: "hinglish" | "hindi" | "english";
  customPrompt?: string;
}

export interface BannerRequest {
  festival: string;
  shopType: string;
  customText?: string;
}

export interface SocialMediaPostRequest {
  platform: "facebook" | "instagram";
  shopType: string;
  occasion?: string;
  language: "hinglish" | "hindi" | "english";
}

export async function generateWhatsAppMessage(request: WhatsAppMessageRequest): Promise<{
  message: string;
  suggestions: string[];
}> {
  try {
    const languageInstruction = {
      hinglish: "Mix of Hindi and English (Hinglish) that's commonly used by Indian shopkeepers",
      hindi: "Pure Hindi in Devanagari script",
      english: "Simple English that's easy to understand"
    }[request.language];

    const prompt = `Generate a WhatsApp marketing message for a ${request.shopType} in ${languageInstruction}.
    ${request.occasion ? `This is for ${request.occasion} occasion.` : ''}
    ${request.customPrompt ? `Additional context: ${request.customPrompt}` : ''}
    
    The message should be:
    - Friendly and culturally appropriate for Indian customers
    - Include relevant emojis
    - Be persuasive but not pushy
    - Suitable for WhatsApp (conversational tone)
    - Under 160 characters if possible
    
    Also provide 2 alternative variations of the message.
    
    Respond in JSON format: {
      "message": "main message",
      "suggestions": ["variation 1", "variation 2"]
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      message: result.message || "नमस्ते! आज ही हमारे स्टोर में आइए और खास छूट पाइए! 🛍️",
      suggestions: result.suggestions || ["Special offers available today!", "Visit us for great deals! 🎉"]
    };
  } catch (error) {
    console.error("Error generating WhatsApp message:", error);
    throw new Error("Failed to generate WhatsApp message");
  }
}

export async function generateBannerContent(request: BannerRequest): Promise<{
  title: string;
  subtitle: string;
  colors: string[];
  elements: string[];
}> {
  try {
    const prompt = `Generate banner content for a ${request.festival} promotion for a ${request.shopType}.
    ${request.customText ? `Include this text: ${request.customText}` : ''}
    
    The banner should be:
    - Festive and colorful
    - Culturally appropriate for Indian festivals
    - Include traditional symbols and elements
    - Appeal to local customers
    
    Suggest appropriate colors, title, subtitle, and design elements.
    
    Respond in JSON format: {
      "title": "main title text",
      "subtitle": "subtitle or tagline",
      "colors": ["color1", "color2", "color3"],
      "elements": ["element1", "element2", "element3"]
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      title: result.title || "Festival Special!",
      subtitle: result.subtitle || "Great offers inside",
      colors: result.colors || ["#FF9933", "#138808", "#FFD700"],
      elements: result.elements || ["Decorative border", "Festival symbols", "Discount text"]
    };
  } catch (error) {
    console.error("Error generating banner content:", error);
    throw new Error("Failed to generate banner content");
  }
}

export async function generateSocialMediaPost(request: SocialMediaPostRequest): Promise<{
  caption: string;
  hashtags: string[];
  suggestions: string[];
}> {
  try {
    const languageInstruction = {
      hinglish: "Mix of Hindi and English (Hinglish)",
      hindi: "Hindi in Devanagari script",
      english: "Simple English"
    }[request.language];

    const prompt = `Generate a ${request.platform} post for a ${request.shopType} in ${languageInstruction}.
    ${request.occasion ? `This is for ${request.occasion} occasion.` : ''}
    
    The post should be:
    - Engaging and shareable
    - Include relevant emojis
    - Culturally appropriate for Indian audience
    - Optimized for ${request.platform}
    
    Provide caption, relevant hashtags, and alternative captions.
    
    Respond in JSON format: {
      "caption": "main post caption",
      "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
      "suggestions": ["alternative caption 1", "alternative caption 2"]
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      caption: result.caption || "Visit our store for amazing deals! 🛍️",
      hashtags: result.hashtags || ["#LocalStore", "#Shopping", "#Deals"],
      suggestions: result.suggestions || ["Great offers available!", "Come and explore our collection! ✨"]
    };
  } catch (error) {
    console.error("Error generating social media post:", error);
    throw new Error("Failed to generate social media post");
  }
}

export async function generateBusinessInsights(shopType: string, customerData: any[]): Promise<{
  insights: string[];
  recommendations: string[];
}> {
  try {
    const prompt = `Analyze business data for a ${shopType} with ${customerData.length} customers.
    Provide actionable business insights and marketing recommendations for an Indian retail context.
    
    Consider:
    - Seasonal trends in India
    - Local customer behavior
    - Festival marketing opportunities
    - Digital marketing strategies suitable for small retailers
    
    Respond in JSON format: {
      "insights": ["insight 1", "insight 2", "insight 3"],
      "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      insights: result.insights || ["Customer engagement is important", "Festival seasons drive sales", "Digital presence helps growth"],
      recommendations: result.recommendations || ["Create festival promotions", "Use WhatsApp for customer communication", "Implement loyalty programs"]
    };
  } catch (error) {
    console.error("Error generating business insights:", error);
    throw new Error("Failed to generate business insights");
  }
}
