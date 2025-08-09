import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, TrendingUp, Users, MessageSquare, Eye, MousePointer, IndianRupee } from "lucide-react";
import { useLocation } from "wouter";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import BottomNavigation from "@/components/bottom-navigation";

export default function Analytics() {
  const [, setLocation] = useLocation();
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const shopId = "demo-shop-1";

  const { data: stats } = useQuery({
    queryKey: ["/api/analytics/stats", shopId],
  });

  const { data: campaigns } = useQuery({
    queryKey: ["/api/campaigns/shop", shopId],
  });

  const { data: customers } = useQuery({
    queryKey: ["/api/customers/shop", shopId],
  });

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "hi" : "en");
  };

  // Mock data for charts (in a real app, this would come from the API)
  const campaignPerformanceData = [
    { name: language === "hi" ? "WhatsApp" : "WhatsApp", views: 1234, clicks: 89, conversion: 7.2 },
    { name: language === "hi" ? "बैनर" : "Banner", views: 856, clicks: 45, conversion: 5.3 },
    { name: language === "hi" ? "सोशल" : "Social", views: 692, clicks: 32, conversion: 4.6 },
    { name: language === "hi" ? "QR कोड" : "QR Code", views: 423, clicks: 28, conversion: 6.6 },
  ];

  const revenueData = [
    { month: language === "hi" ? "जन" : "Jan", revenue: 45000 },
    { month: language === "hi" ? "फर" : "Feb", revenue: 52000 },
    { month: language === "hi" ? "मार" : "Mar", revenue: 48000 },
    { month: language === "hi" ? "अप्र" : "Apr", revenue: 61000 },
    { month: language === "hi" ? "मई" : "May", revenue: 55000 },
    { month: language === "hi" ? "जून" : "Jun", revenue: 67000 },
  ];

  const customerSegmentData = [
    { name: language === "hi" ? "नए ग्राहक" : "New Customers", value: 35, color: "#FF9933" },
    { name: language === "hi" ? "वफादार ग्राहक" : "Loyal Customers", value: 45, color: "#138808" },
    { name: language === "hi" ? "निष्क्रिय ग्राहक" : "Inactive", value: 20, color: "#DC143C" },
  ];

  const totalViews = campaigns?.reduce((sum: number, campaign: any) => sum + (campaign.views || 0), 0) || 0;
  const totalClicks = campaigns?.reduce((sum: number, campaign: any) => sum + (campaign.clicks || 0), 0) || 0;
  const conversionRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0";

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen shadow-xl">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 shadow-md">
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
                {language === "hi" ? "विश्लेषण डैशबोर्ड" : "Analytics Dashboard"}
              </h1>
              <p className="text-sm opacity-90">
                {language === "hi" ? "व्यापार प्रदर्शन रिपोर्ट" : "Business performance insights"}
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

      <div className="p-4 pb-24">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="bg-gradient-to-br from-saffron/10 to-saffron/20 border-saffron/30">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-saffron" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === "hi" ? "आज की आय" : "Today's Revenue"}
              </p>
              <p className="text-lg font-bold text-saffron" data-testid="text-today-revenue">
                ₹{stats?.todayRevenue?.toLocaleString('en-IN') || '8,450'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indian-green/10 to-indian-green/20 border-indian-green/30">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-indian-green" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === "hi" ? "कुल ग्राहक" : "Total Customers"}
              </p>
              <p className="text-lg font-bold text-indian-green" data-testid="text-total-customers">
                {customers?.length || 156}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/20 border-blue-500/30">
            <CardContent className="p-4 text-center">
              <Eye className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === "hi" ? "कुल दृश्य" : "Total Views"}
              </p>
              <p className="text-lg font-bold text-blue-500" data-testid="text-total-views">
                {totalViews.toLocaleString('en-IN')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/20 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <MousePointer className="w-6 h-6 mx-auto mb-2 text-purple-500" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === "hi" ? "रूपांतरण दर" : "Conversion Rate"}
              </p>
              <p className="text-lg font-bold text-purple-500" data-testid="text-conversion-rate">
                {conversionRate}%
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="campaigns" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="campaigns" className="text-xs">
              {language === "hi" ? "अभियान" : "Campaigns"}
            </TabsTrigger>
            <TabsTrigger value="revenue" className="text-xs">
              {language === "hi" ? "आय" : "Revenue"}
            </TabsTrigger>
            <TabsTrigger value="customers" className="text-xs">
              {language === "hi" ? "ग्राहक" : "Customers"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  {language === "hi" ? "अभियान प्रदर्शन" : "Campaign Performance"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={campaignPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="views" fill="var(--saffron)" name={language === "hi" ? "दृश्य" : "Views"} />
                      <Bar dataKey="clicks" fill="var(--indian-green)" name={language === "hi" ? "क्लिक" : "Clicks"} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Campaign List */}
            <div className="mt-4 space-y-3">
              {campaigns?.map((campaign: any) => (
                <Card key={campaign.id} className="bg-gray-50 dark:bg-gray-800" data-testid={`card-campaign-${campaign.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">
                        {campaign.title}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        campaign.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {campaign.status === 'active' ? 
                          (language === "hi" ? "सक्रिय" : "Active") : 
                          (language === "hi" ? "निर्धारित" : "Scheduled")
                        }
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>👁️ {campaign.views || 0} {language === "hi" ? "दृश्य" : "views"}</span>
                      <span>👆 {campaign.clicks || 0} {language === "hi" ? "क्लिक" : "clicks"}</span>
                      <span>📈 {campaign.views > 0 ? ((campaign.clicks / campaign.views) * 100).toFixed(1) : 0}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-green-600" />
                  {language === "hi" ? "आय रुझान" : "Revenue Trends"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, language === "hi" ? "आय" : "Revenue"]} />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="var(--indian-green)" 
                        strokeWidth={3}
                        dot={{ fill: "var(--indian-green)", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Summary */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <Card className="text-center">
                <CardContent className="p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {language === "hi" ? "इस महीने" : "This Month"}
                  </p>
                  <p className="text-lg font-bold text-indian-green">₹67,000</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {language === "hi" ? "पिछले महीने" : "Last Month"}
                  </p>
                  <p className="text-lg font-bold text-gray-700 dark:text-gray-300">₹55,000</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {language === "hi" ? "वृद्धि" : "Growth"}
                  </p>
                  <p className="text-lg font-bold text-green-600">+21.8%</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  {language === "hi" ? "ग्राहक विभाजन" : "Customer Segments"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={customerSegmentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {customerSegmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, ""]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {customerSegmentData.map((segment, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: segment.color }}
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {segment.name}
                        </span>
                      </div>
                      <span className="text-sm font-medium">{segment.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer Insights */}
            <Card className="mt-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="text-lg text-purple-700 dark:text-purple-300">
                  {language === "hi" ? "ग्राहक अंतर्दृष्टि" : "Customer Insights"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border-l-4 border-purple-500">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    📈 {language === "hi" ? "सबसे सक्रिय समय" : "Most Active Time"}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {language === "hi" ? 
                      "शाम 6-8 बजे के बीच 65% अधिक खरीदारी" : 
                      "65% more purchases between 6-8 PM"
                    }
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border-l-4 border-green-500">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    💳 {language === "hi" ? "औसत खरीदारी" : "Average Purchase"}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {language === "hi" ? 
                      "प्रति ग्राहक ₹425 औसत बिल राशि" : 
                      "₹425 average bill amount per customer"
                    }
                  </p>
                </div>
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
