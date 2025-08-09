import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertShopSchema, insertCustomerSchema, insertCampaignSchema, insertWhatsappMessageSchema, insertBannerSchema } from "@shared/schema";
import { generateWhatsAppMessage, generateBannerContent, generateSocialMediaPost, generateBusinessInsights } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Shop routes
  app.get("/api/shops/:id", async (req, res) => {
    try {
      const shop = await storage.getShop(req.params.id);
      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }
      res.json(shop);
    } catch (error) {
      res.status(500).json({ message: "Failed to get shop" });
    }
  });

  app.get("/api/shops/user/:userId", async (req, res) => {
    try {
      const shop = await storage.getShopByUserId(req.params.userId);
      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }
      res.json(shop);
    } catch (error) {
      res.status(500).json({ message: "Failed to get shop" });
    }
  });

  app.post("/api/shops", async (req, res) => {
    try {
      const shopData = insertShopSchema.parse(req.body);
      const shop = await storage.createShop(shopData);
      res.status(201).json(shop);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(400).json({ message: "Invalid shop data", error: errorMessage });
    }
  });

  app.patch("/api/shops/:id", async (req, res) => {
    try {
      const shopData = insertShopSchema.partial().parse(req.body);
      const shop = await storage.updateShop(req.params.id, shopData);
      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }
      res.json(shop);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(400).json({ message: "Invalid shop data", error: errorMessage });
    }
  });

  // Customer routes
  app.get("/api/customers/shop/:shopId", async (req, res) => {
    try {
      const customers = await storage.getCustomers(req.params.shopId);
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: "Failed to get customers" });
    }
  });

  app.post("/api/customers", async (req, res) => {
    try {
      const customerData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(customerData);
      res.status(201).json(customer);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(400).json({ message: "Invalid customer data", error: errorMessage });
    }
  });

  app.patch("/api/customers/:id", async (req, res) => {
    try {
      const customerData = insertCustomerSchema.partial().parse(req.body);
      const customer = await storage.updateCustomer(req.params.id, customerData);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(400).json({ message: "Invalid customer data", error: errorMessage });
    }
  });

  // Campaign routes
  app.get("/api/campaigns/shop/:shopId", async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns(req.params.shopId);
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: "Failed to get campaigns" });
    }
  });

  app.post("/api/campaigns", async (req, res) => {
    try {
      const campaignData = insertCampaignSchema.parse(req.body);
      const campaign = await storage.createCampaign(campaignData);
      res.status(201).json(campaign);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(400).json({ message: "Invalid campaign data", error: errorMessage });
    }
  });

  app.patch("/api/campaigns/:id", async (req, res) => {
    try {
      const campaignData = insertCampaignSchema.partial().parse(req.body);
      const campaign = await storage.updateCampaign(req.params.id, campaignData);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(400).json({ message: "Invalid campaign data", error: errorMessage });
    }
  });

  // WhatsApp message generation
  app.post("/api/whatsapp/generate", async (req, res) => {
    try {
      const { shopType, occasion, language, customPrompt } = req.body;
      const result = await generateWhatsAppMessage({
        shopType,
        occasion,
        language: language || "hinglish",
        customPrompt
      });
      res.json(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ message: "Failed to generate WhatsApp message", error: errorMessage });
    }
  });

  app.post("/api/whatsapp/save", async (req, res) => {
    try {
      const messageData = insertWhatsappMessageSchema.parse(req.body);
      const message = await storage.createWhatsappMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(400).json({ message: "Invalid message data", error: errorMessage });
    }
  });

  app.get("/api/whatsapp/shop/:shopId", async (req, res) => {
    try {
      const messages = await storage.getWhatsappMessages(req.params.shopId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to get WhatsApp messages" });
    }
  });

  // Banner generation
  app.post("/api/banners/generate", async (req, res) => {
    try {
      const { festival, shopType, customText } = req.body;
      const result = await generateBannerContent({
        festival,
        shopType,
        customText
      });
      res.json(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ message: "Failed to generate banner content", error: errorMessage });
    }
  });

  app.post("/api/banners/save", async (req, res) => {
    try {
      const bannerData = insertBannerSchema.parse(req.body);
      const banner = await storage.createBanner(bannerData);
      res.status(201).json(banner);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(400).json({ message: "Invalid banner data", error: errorMessage });
    }
  });

  app.get("/api/banners/shop/:shopId", async (req, res) => {
    try {
      const banners = await storage.getBanners(req.params.shopId);
      res.json(banners);
    } catch (error) {
      res.status(500).json({ message: "Failed to get banners" });
    }
  });

  // Social media post generation
  app.post("/api/social/generate", async (req, res) => {
    try {
      const { platform, shopType, occasion, language } = req.body;
      const result = await generateSocialMediaPost({
        platform,
        shopType,
        occasion,
        language: language || "hinglish"
      });
      res.json(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ message: "Failed to generate social media post", error: errorMessage });
    }
  });

  // Analytics and insights
  app.get("/api/analytics/stats/:shopId", async (req, res) => {
    try {
      const stats = await storage.getShopStats(req.params.shopId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get shop stats" });
    }
  });

  app.post("/api/analytics/insights", async (req, res) => {
    try {
      const { shopType, customerData } = req.body;
      const insights = await generateBusinessInsights(shopType, customerData || []);
      res.json(insights);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ message: "Failed to generate insights", error: errorMessage });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
