import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, IndianRupee, ShoppingCart, Users, Flame, Plus } from "lucide-react";
import BottomNavigation from "@/components/bottom-navigation";
import LanguageToggle from "@/components/language-toggle";

export default function Home() {
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const shopId = "demo-shop-1"; // Demo shop ID

  const { data: shop } = useQuery({
    queryKey: ["/api/shops", shopId],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/analytics/stats", shopId],
  });

  const { data: campaigns } = useQuery({
    queryKey: ["/api/campaigns/shop", shopId],
  });

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "hi" : "en");
  };

  const quickActions = [
    {
      title: language === "hi" ? "WhatsApp मार्केटिंग" : "WhatsApp Marketing",
      description: language === "hi" ? "हिंग्लिश में ऑटो-जेनरेट संदेश" : "Auto-generate messages in Hinglish",
      icon: "💬",
      color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
      textColor: "text-green-600 dark:text-green-400",
      badge: "AI Powered",
      path: "/marketing?tool=whatsapp"
    },
    {
      title: language === "hi" ? "त्योहारी बैनर" : "Festival Banners",
      description: language === "hi" ? "सभी त्योहारों के लिए तैयार टेम्प्लेट" : "Ready templates for all festivals",
      icon: "🎨",
      color: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
      textColor: "text-orange-600 dark:text-orange-400",
      badge: "Templates",
      path: "/marketing?tool=banner"
    },
    {
      title: language === "hi" ? "ग्राहक डेटाबेस" : "Customer Database",
      description: language === "hi" ? "वफादार ग्राहकों का प्रबंधन" : "Manage loyal customers",
      icon: "🗄️",
      color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
      textColor: "text-blue-600 dark:text-blue-400",
      badge: "CRM",
      path: "/customers"
    },
    {
      title: language === "hi" ? "सोशल मीडिया" : "Social Media",
      description: language === "hi" ? "Facebook और Instagram पोस्ट" : "Facebook & Instagram posts",
      icon: "📱",
      color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
      textColor: "text-purple-600 dark:text-purple-400",
      badge: "Auto Post",
      path: "/marketing?tool=social"
    },
    {
      title: language === "hi" ? "लॉयल्टी प्रोग्राम" : "Loyalty Program",
      description: language === "hi" ? "नियमित ग्राहकों को पुरस्कृत करें" : "Reward regular customers",
      icon: "🎁",
      color: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
      textColor: "text-yellow-600 dark:text-yellow-400",
      badge: "Points",
      path: "/customers?tab=loyalty"
    },
    {
      title: language === "hi" ? "QR रेफरल" : "QR Referrals",
      description: language === "hi" ? "आसान ग्राहक रेफरल सिस्टम" : "Easy customer referral system",
      icon: "📱",
      color: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800",
      textColor: "text-indigo-600 dark:text-indigo-400",
      badge: "QR Code",
      path: "/marketing?tool=qr"
    }
  ];

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen shadow-xl">
      {/* Header */}
      <header className="bg-gradient-to-r from-saffron to-deep-saffron text-white p-4 shadow-indian">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
              alt="Shop Owner" 
              className="w-12 h-12 rounded-full border-2 border-white object-cover"
            />
            <div>
              <h1 className="text-lg font-semibold font-devanagari" data-testid="text-shop-name">
                {shop?.name || (language === "hi" ? "राम जी स्टोर" : "Ram Ji Store")}
              </h1>
              <p className="text-sm opacity-90" data-testid="text-shop-type">
                {shop?.type || "Kirana Store"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <LanguageToggle language={language} onToggle={toggleLanguage} />
            <button className="relative" data-testid="button-notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-indian-red text-xs w-5 h-5 rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <section className="p-4 bg-gradient-to-br from-indian-green to-green-600 text-white">
        <h2 className="text-lg font-semibold mb-3 font-devanagari">
          {language === "hi" ? "आज का व्यापार" : "Today's Business"}
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <IndianRupee className="w-6 h-6 mx-auto mb-1" />
            <p className="text-sm opacity-90">
              {language === "hi" ? "आय" : "Revenue"}
            </p>
            <p className="text-lg font-bold" data-testid="text-today-revenue">
              ₹{stats?.todayRevenue?.toLocaleString('en-IN') || '8,450'}
            </p>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <ShoppingCart className="w-6 h-6 mx-auto mb-1" />
            <p className="text-sm opacity-90">
              {language === "hi" ? "ऑर्डर" : "Orders"}
            </p>
            <p className="text-lg font-bold" data-testid="text-today-orders">
              {stats?.todayOrders || 23}
            </p>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <Users className="w-6 h-6 mx-auto mb-1" />
            <p className="text-sm opacity-90">
              {language === "hi" ? "ग्राहक" : "Customers"}
            </p>
            <p className="text-lg font-bold" data-testid="text-total-customers">
              {stats?.totalCustomers || 156}
            </p>
          </div>
        </div>
      </section>

      {/* Festival Promotion Banner */}
      <section className="p-4">
        <div className="bg-gradient-to-r from-indian-red via-festival-orange to-indian-gold rounded-xl p-4 text-white shadow-festival relative overflow-hidden">
          <div className="absolute top-0 right-0 text-6xl opacity-20">
            <Flame className="w-16 h-16" />
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-1">
              🪔 {language === "hi" ? "दिवाली विशेष ऑफर!" : "Diwali Special Offer!"}
            </h3>
            <p className="text-sm mb-3">
              {language === "hi" ? "30 सेकंड में शानदार त्योहारी बैनर बनाएं" : "Create stunning festival banners in 30 seconds"}
            </p>
            <Button 
              className="bg-white text-indian-red hover:bg-gray-100 font-semibold text-sm"
              data-testid="button-create-festival-banner"
            >
              {language === "hi" ? "अभी बैनर बनाएं" : "Create Banner Now"}
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {language === "hi" ? "मार्केटिंग टूल्स" : "Marketing Tools"}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <Card key={index} className={`${action.color} shadow-sm hover:shadow-md transition-shadow cursor-pointer`} data-testid={`card-quick-action-${index}`}>
              <CardContent className="p-4">
                <div className={`text-3xl mb-2 ${action.textColor}`}>
                  <span className="text-2xl">{action.icon}</span>
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 text-sm">
                  {action.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {action.description}
                </p>
                <Badge variant="secondary" className="text-xs">
                  {action.badge}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Campaigns */}
      <section className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {language === "hi" ? "हाल के अभियान" : "Recent Campaigns"}
          </h2>
          <Button variant="ghost" size="sm" className="text-saffron" data-testid="button-view-all-campaigns">
            {language === "hi" ? "सभी देखें" : "View All"}
          </Button>
        </div>
        
        <div className="space-y-3">
          {campaigns?.slice(0, 2).map((campaign: any) => (
            <Card key={campaign.id} className="shadow-sm" data-testid={`card-campaign-${campaign.id}`}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                    {campaign.title}
                  </h3>
                  <Badge 
                    variant={campaign.status === "active" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {campaign.status === "active" ? 
                      (language === "hi" ? "सक्रिय" : "Active") : 
                      (language === "hi" ? "निर्धारित" : "Scheduled")
                    }
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {campaign.description}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="flex items-center">
                    👁️ {campaign.views || 0} {language === "hi" ? "दृश्य" : "views"}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="flex items-center">
                    👆 {campaign.clicks || 0} {language === "hi" ? "क्लिक" : "clicks"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* AI Insights */}
      <section className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 mx-4 rounded-xl mb-4">
        <div className="flex items-center mb-3">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-lg mr-3">
            🧠
          </div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {language === "hi" ? "AI सुझाव" : "AI Suggestions"}
          </h2>
        </div>
        
        <div className="space-y-2">
          <div className="bg-white dark:bg-gray-800 border-l-4 border-purple-500 p-3 rounded-r-lg">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              🎯 {language === "hi" ? "त्योहारी सीज़न अवसर" : "Festive Season Opportunity"}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {language === "hi" ? 
                "करवा चौथ प्रमोशन बनाएं - 85% ज्यादा एंगेजमेंट की उम्मीद" : 
                "Create Karva Chauth promotion - 85% higher engagement expected"
              }
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border-l-4 border-green-500 p-3 rounded-r-lg">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              📈 {language === "hi" ? "ट्रेंडिंग उत्पाद" : "Trending Products"}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {language === "hi" ? 
                "आपके क्षेत्र में इलेक्ट्रॉनिक्स की मांग 40% बढ़ी है। विशेष ऑफर का विचार करें।" : 
                "Electronics demand up 40% in your area. Consider special offers."
              }
            </p>
          </div>
        </div>
      </section>

      {/* Bottom padding for navigation */}
      <div className="h-20"></div>

      {/* Floating Action Button */}
      <Button 
        className="fixed bottom-20 right-4 bg-gradient-to-r from-saffron to-deep-saffron text-white p-4 rounded-full shadow-indian z-40 max-w-md transform translate-x-0"
        size="icon"
        data-testid="button-quick-create-campaign"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Bottom Navigation */}
      <BottomNavigation language={language} />
    </div>
  );
}
