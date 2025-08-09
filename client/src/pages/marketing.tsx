import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import BottomNavigation from "@/components/bottom-navigation";
import WhatsAppTool from "@/components/whatsapp-tool";
import BannerTool from "@/components/banner-tool";

export default function Marketing() {
  const [, setLocation] = useLocation();
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const shopId = "demo-shop-1";

  const { data: shop } = useQuery({
    queryKey: ["/api/shops", shopId],
  });

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "hi" : "en");
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen shadow-xl">
      {/* Header */}
      <header className="bg-gradient-to-r from-saffron to-deep-saffron text-white p-4 shadow-indian">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setLocation("/")}
              className="text-white hover:bg-white/20"
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">
                {language === "hi" ? "मार्केटिंग टूल्स" : "Marketing Tools"}
              </h1>
              <p className="text-sm opacity-90">
                {language === "hi" ? "AI-संचालित मार्केटिंग समाधान" : "AI-powered marketing solutions"}
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleLanguage}
            className="bg-white/20 hover:bg-white/30 text-white border-0"
            data-testid="button-language-toggle"
          >
            {language === "en" ? "हिं" : "EN"}
          </Button>
        </div>
      </header>

      {/* Marketing Tools */}
      <div className="p-4 pb-24">
        <Tabs defaultValue="whatsapp" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="whatsapp" className="text-xs">
              {language === "hi" ? "WhatsApp" : "WhatsApp"}
            </TabsTrigger>
            <TabsTrigger value="banner" className="text-xs">
              {language === "hi" ? "बैनर" : "Banner"}
            </TabsTrigger>
            <TabsTrigger value="social" className="text-xs">
              {language === "hi" ? "सोशल" : "Social"}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs">
              {language === "hi" ? "रिपोर्ट" : "Reports"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="whatsapp" className="mt-4">
            <WhatsAppTool 
              shopType={shop?.type || "Kirana Store"} 
              shopId={shopId} 
              language={language} 
            />
          </TabsContent>

          <TabsContent value="banner" className="mt-4">
            <BannerTool 
              shopType={shop?.type || "Kirana Store"} 
              shopId={shopId} 
              language={language} 
            />
          </TabsContent>

          <TabsContent value="social" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-600">
                  {language === "hi" ? "सोशल मीडिया पोस्ट" : "Social Media Posts"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                  {language === "hi" ? 
                    "सोशल मीडिया टूल जल्द उपलब्ध होगा..." : 
                    "Social media tool coming soon..."
                  }
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">
                  {language === "hi" ? "मार्केटिंग रिपोर्ट्स" : "Marketing Reports"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                  {language === "hi" ? 
                    "विस्तृत रिपोर्ट्स जल्द उपलब्ध होंगी..." : 
                    "Detailed reports coming soon..."
                  }
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation language={language} />
    </div>
  );
}
