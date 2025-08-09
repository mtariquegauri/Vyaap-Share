import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, User, Store, Settings, Bell, Globe, Save, Loader2, Phone, MapPin } from "lucide-react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertShopSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/bottom-navigation";

export default function Profile() {
  const [, setLocation] = useLocation();
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoMarketing, setAutoMarketing] = useState(false);
  const shopId = "demo-shop-1";
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: shop, isLoading } = useQuery({
    queryKey: ["/api/shops", shopId],
  });

  const form = useForm({
    resolver: zodResolver(insertShopSchema.partial()),
    defaultValues: {
      name: shop?.name || "",
      type: shop?.type || "",
      ownerName: shop?.ownerName || "",
      phone: shop?.phone || "",
      address: shop?.address || "",
      language: shop?.language || "en",
    },
  });

  // Update form when shop data loads
  useState(() => {
    if (shop) {
      form.reset({
        name: shop.name,
        type: shop.type,
        ownerName: shop.ownerName,
        phone: shop.phone,
        address: shop.address,
        language: shop.language,
      });
    }
  });

  const updateShopMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PATCH", `/api/shops/${shopId}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shops", shopId] });
      toast({
        title: language === "hi" ? "प्रोफ़ाइल अपडेट हो गई!" : "Profile Updated!",
        description: language === "hi" ? "आपकी दुकान की जानकारी सफलतापूर्वक अपडेट हो गई।" : "Your shop information has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: language === "hi" ? "त्रुटि" : "Error",
        description: language === "hi" ? "प्रोफ़ाइल अपडेट करने में समस्या हुई।" : "Failed to update profile.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    updateShopMutation.mutate(data);
  };

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "hi" : "en";
    setLanguage(newLanguage);
    form.setValue("language", newLanguage);
  };

  const shopTypes = [
    { value: "Kirana Store", label: language === "hi" ? "किराना स्टोर" : "Kirana Store" },
    { value: "Electronics", label: language === "hi" ? "इलेक्ट्रॉनिक्स" : "Electronics" },
    { value: "Boutique", label: language === "hi" ? "बुटीक" : "Boutique" },
    { value: "Medical Store", label: language === "hi" ? "मेडिकल स्टोर" : "Medical Store" },
    { value: "Hardware Store", label: language === "hi" ? "हार्डवेयर स्टोर" : "Hardware Store" },
    { value: "Stationery", label: language === "hi" ? "स्टेशनरी" : "Stationery" },
    { value: "Gift Shop", label: language === "hi" ? "गिफ्ट शॉप" : "Gift Shop" },
    { value: "Bakery", label: language === "hi" ? "बेकरी" : "Bakery" },
    { value: "Other", label: language === "hi" ? "अन्य" : "Other" },
  ];

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen shadow-xl flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-saffron" />
      </div>
    );
  }

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
                {language === "hi" ? "प्रोफ़ाइल और सेटिंग्स" : "Profile & Settings"}
              </h1>
              <p className="text-sm opacity-90">
                {language === "hi" ? "दुकान की जानकारी प्रबंधित करें" : "Manage shop information"}
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

      <div className="p-4 pb-24 space-y-6">
        {/* Shop Owner Info */}
        <Card className="bg-gradient-to-br from-saffron/10 to-orange-100 dark:from-saffron/20 dark:to-orange-900/20 border-saffron/30">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="w-16 h-16 bg-saffron rounded-full flex items-center justify-center">
              <Store className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200" data-testid="text-shop-name">
                {shop?.name || (language === "hi" ? "राम जी स्टोर" : "Ram Ji Store")}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400" data-testid="text-shop-type">
                {shop?.type || "Kirana Store"}
              </p>
              <p className="text-xs text-saffron font-medium">
                {language === "hi" ? "सत्यापित व्यापारी" : "Verified Merchant"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Shop Information Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5 text-saffron" />
              {language === "hi" ? "दुकान की जानकारी" : "Shop Information"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {language === "hi" ? "दुकान का नाम" : "Shop Name"}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-shop-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {language === "hi" ? "दुकान का प्रकार" : "Shop Type"}
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-shop-type">
                            <SelectValue placeholder={language === "hi" ? "प्रकार चुनें..." : "Select type..."} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {shopTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ownerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {language === "hi" ? "मालिक का नाम" : "Owner Name"}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-owner-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {language === "hi" ? "फोन नंबर" : "Phone Number"}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="+91-9876543210" data-testid="input-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {language === "hi" ? "पूरा पता" : "Complete Address"}
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder={language === "hi" ? "दुकान का पूरा पता..." : "Complete shop address..."}
                          data-testid="textarea-address"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-saffron hover:bg-deep-saffron text-white"
                  disabled={updateShopMutation.isPending}
                  data-testid="button-save-profile"
                >
                  {updateShopMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {language === "hi" ? "जानकारी सहेजें" : "Save Information"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              {language === "hi" ? "प्राथमिकताएं" : "Preferences"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-600" />
                <Label htmlFor="language-preference" className="text-sm">
                  {language === "hi" ? "भाषा प्राथमिकता" : "Language Preference"}
                </Label>
              </div>
              <Select value={language} onValueChange={(value) => setLanguage(value as "en" | "hi")}>
                <SelectTrigger className="w-32" data-testid="select-language-preference">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-gray-600" />
                <Label htmlFor="notifications" className="text-sm">
                  {language === "hi" ? "सूचनाएं चालू करें" : "Enable Notifications"}
                </Label>
              </div>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
                data-testid="switch-notifications"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-600" />
                <Label htmlFor="auto-marketing" className="text-sm">
                  {language === "hi" ? "ऑटो मार्केटिंग" : "Auto Marketing"}
                </Label>
              </div>
              <Switch
                id="auto-marketing"
                checked={autoMarketing}
                onCheckedChange={setAutoMarketing}
                data-testid="switch-auto-marketing"
              />
            </div>
          </CardContent>
        </Card>

        {/* Business Stats */}
        <Card className="bg-gradient-to-br from-indian-green/10 to-green-100 dark:from-indian-green/20 dark:to-green-900/20 border-indian-green/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indian-green">
              📊 {language === "hi" ? "व्यापार आंकड़े" : "Business Stats"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-indian-green">45</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === "hi" ? "कुल अभियान" : "Total Campaigns"}
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-indian-green">₹2.8L</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === "hi" ? "मासिक आय" : "Monthly Revenue"}
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-indian-green">156</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === "hi" ? "वफादार ग्राहक" : "Loyal Customers"}
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-indian-green">4.8</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === "hi" ? "रेटिंग" : "Rating"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help & Support */}
        <Card>
          <CardHeader>
            <CardTitle className="text-purple-600">
              {language === "hi" ? "सहायता और समर्थन" : "Help & Support"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" data-testid="button-help-tutorials">
              📚 {language === "hi" ? "ट्यूटोरियल देखें" : "View Tutorials"}
            </Button>
            <Button variant="outline" className="w-full justify-start" data-testid="button-contact-support">
              💬 {language === "hi" ? "सहायता टीम से संपर्क करें" : "Contact Support Team"}
            </Button>
            <Button variant="outline" className="w-full justify-start" data-testid="button-feedback">
              ⭐ {language === "hi" ? "फीडबैक दें" : "Give Feedback"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation language={language} />
    </div>
  );
}
