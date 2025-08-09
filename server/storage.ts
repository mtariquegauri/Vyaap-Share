import { type User, type InsertUser, type Shop, type InsertShop, type Customer, type InsertCustomer, type Campaign, type InsertCampaign, type WhatsappMessage, type InsertWhatsappMessage, type Banner, type InsertBanner } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Shop operations
  getShop(id: string): Promise<Shop | undefined>;
  getShopByUserId(userId: string): Promise<Shop | undefined>;
  createShop(shop: InsertShop): Promise<Shop>;
  updateShop(id: string, shop: Partial<InsertShop>): Promise<Shop | undefined>;

  // Customer operations
  getCustomers(shopId: string): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;

  // Campaign operations
  getCampaigns(shopId: string): Promise<Campaign[]>;
  getCampaign(id: string): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: string, campaign: Partial<InsertCampaign>): Promise<Campaign | undefined>;

  // WhatsApp message operations
  getWhatsappMessages(shopId: string): Promise<WhatsappMessage[]>;
  createWhatsappMessage(message: InsertWhatsappMessage): Promise<WhatsappMessage>;

  // Banner operations
  getBanners(shopId: string): Promise<Banner[]>;
  createBanner(banner: InsertBanner): Promise<Banner>;

  // Analytics
  getShopStats(shopId: string): Promise<{
    todayRevenue: number;
    todayOrders: number;
    totalCustomers: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private shops: Map<string, Shop>;
  private customers: Map<string, Customer>;
  private campaigns: Map<string, Campaign>;
  private whatsappMessages: Map<string, WhatsappMessage>;
  private banners: Map<string, Banner>;

  constructor() {
    this.users = new Map();
    this.shops = new Map();
    this.customers = new Map();
    this.campaigns = new Map();
    this.whatsappMessages = new Map();
    this.banners = new Map();

    // Create demo shop
    this.initializeDemoData();
  }

  private async initializeDemoData() {
    const demoUser: User = {
      id: "demo-user-1",
      username: "ramji",
      password: "password123"
    };
    this.users.set(demoUser.id, demoUser);

    const demoShop: Shop = {
      id: "demo-shop-1",
      name: "राम जी स्टोर",
      type: "Kirana Store",
      ownerName: "Ram Singh",
      phone: "+91-9876543210",
      address: "Main Market, Delhi",
      language: "hi",
      userId: demoUser.id,
      createdAt: new Date()
    };
    this.shops.set(demoShop.id, demoShop);

    // Add demo customers
    const demoCustomers: Customer[] = [
      {
        id: "customer-1",
        name: "Sunita Sharma",
        phone: "+91-9876543211",
        email: "sunita@email.com",
        loyaltyPoints: 150,
        lastPurchase: new Date(),
        shopId: demoShop.id,
        createdAt: new Date()
      },
      {
        id: "customer-2", 
        name: "Rajesh Kumar",
        phone: "+91-9876543212",
        email: "rajesh@email.com",
        loyaltyPoints: 89,
        lastPurchase: new Date(Date.now() - 86400000),
        shopId: demoShop.id,
        createdAt: new Date()
      }
    ];

    demoCustomers.forEach(customer => {
      this.customers.set(customer.id, customer);
    });

    // Add demo campaigns
    const demoCampaigns: Campaign[] = [
      {
        id: "campaign-1",
        title: "Diwali Sweets Promotion",
        description: "WhatsApp + Instagram campaign",
        type: "whatsapp",
        content: { message: "🪔 Diwali ki shubhkamnayen! Special discount on sweets and dry fruits. Visit our store today!" },
        status: "active",
        scheduledAt: null,
        views: 1234,
        clicks: 89,
        shopId: demoShop.id,
        createdAt: new Date()
      },
      {
        id: "campaign-2",
        title: "Weekend Sale Banner",
        description: "Auto-generated social media posts",
        type: "banner",
        content: { template: "weekend-sale" },
        status: "scheduled",
        scheduledAt: new Date(Date.now() + 86400000),
        views: 0,
        clicks: 0,
        shopId: demoShop.id,
        createdAt: new Date()
      }
    ];

    demoCampaigns.forEach(campaign => {
      this.campaigns.set(campaign.id, campaign);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getShop(id: string): Promise<Shop | undefined> {
    return this.shops.get(id);
  }

  async getShopByUserId(userId: string): Promise<Shop | undefined> {
    return Array.from(this.shops.values()).find(shop => shop.userId === userId);
  }

  async createShop(insertShop: InsertShop): Promise<Shop> {
    const id = randomUUID();
    const shop: Shop = { 
      ...insertShop, 
      id, 
      language: insertShop.language || "hi",
      userId: insertShop.userId ?? null,
      createdAt: new Date() 
    };
    this.shops.set(id, shop);
    return shop;
  }

  async updateShop(id: string, shopUpdate: Partial<InsertShop>): Promise<Shop | undefined> {
    const shop = this.shops.get(id);
    if (!shop) return undefined;
    
    const updatedShop = { ...shop, ...shopUpdate };
    this.shops.set(id, updatedShop);
    return updatedShop;
  }

  async getCustomers(shopId: string): Promise<Customer[]> {
    return Array.from(this.customers.values()).filter(customer => customer.shopId === shopId);
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = randomUUID();
    const customer: Customer = { 
      ...insertCustomer,
      id, 
      email: insertCustomer.email ?? null,
      loyaltyPoints: insertCustomer.loyaltyPoints ?? 0,
      lastPurchase: insertCustomer.lastPurchase ?? null,
      shopId: insertCustomer.shopId ?? null,
      createdAt: new Date() 
    };
    this.customers.set(id, customer);
    return customer;
  }

  async updateCustomer(id: string, customerUpdate: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const customer = this.customers.get(id);
    if (!customer) return undefined;
    
    const updatedCustomer = { ...customer, ...customerUpdate };
    this.customers.set(id, updatedCustomer);
    return updatedCustomer;
  }

  async getCampaigns(shopId: string): Promise<Campaign[]> {
    return Array.from(this.campaigns.values()).filter(campaign => campaign.shopId === shopId);
  }

  async getCampaign(id: string): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const id = randomUUID();
    const campaign: Campaign = { 
      ...insertCampaign, 
      id, 
      status: insertCampaign.status || "draft",
      content: insertCampaign.content || {},
      scheduledAt: insertCampaign.scheduledAt ?? null,
      views: insertCampaign.views ?? 0,
      clicks: insertCampaign.clicks ?? 0,
      shopId: insertCampaign.shopId ?? null,
      description: insertCampaign.description ?? null,
      createdAt: new Date() 
    };
    this.campaigns.set(id, campaign);
    return campaign;
  }

  async updateCampaign(id: string, campaignUpdate: Partial<InsertCampaign>): Promise<Campaign | undefined> {
    const campaign = this.campaigns.get(id);
    if (!campaign) return undefined;
    
    const updatedCampaign = { ...campaign, ...campaignUpdate };
    this.campaigns.set(id, updatedCampaign);
    return updatedCampaign;
  }

  async getWhatsappMessages(shopId: string): Promise<WhatsappMessage[]> {
    return Array.from(this.whatsappMessages.values()).filter(message => message.shopId === shopId);
  }

  async createWhatsappMessage(insertMessage: InsertWhatsappMessage): Promise<WhatsappMessage> {
    const id = randomUUID();
    const message: WhatsappMessage = { 
      ...insertMessage, 
      id, 
      language: insertMessage.language || "hinglish",
      shopId: insertMessage.shopId ?? null,
      occasion: insertMessage.occasion ?? null,
      createdAt: new Date() 
    };
    this.whatsappMessages.set(id, message);
    return message;
  }

  async getBanners(shopId: string): Promise<Banner[]> {
    return Array.from(this.banners.values()).filter(banner => banner.shopId === shopId);
  }

  async createBanner(insertBanner: InsertBanner): Promise<Banner> {
    const id = randomUUID();
    const banner: Banner = { 
      ...insertBanner, 
      id, 
      shopId: insertBanner.shopId ?? null,
      festival: insertBanner.festival ?? null,
      customText: insertBanner.customText ?? null,
      colors: insertBanner.colors || {},
      createdAt: new Date() 
    };
    this.banners.set(id, banner);
    return banner;
  }

  async getShopStats(shopId: string): Promise<{
    todayRevenue: number;
    todayOrders: number;
    totalCustomers: number;
  }> {
    const customers = await this.getCustomers(shopId);
    
    return {
      todayRevenue: Math.floor(Math.random() * 10000) + 5000, // Demo data
      todayOrders: Math.floor(Math.random() * 50) + 10, // Demo data
      totalCustomers: customers.length
    };
  }
}

export const storage = new MemStorage();
