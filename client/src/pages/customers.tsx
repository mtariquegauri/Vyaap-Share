import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Plus, Phone, Mail, Gift, Search } from "lucide-react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCustomerSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/bottom-navigation";

export default function Customers() {
  const [, setLocation] = useLocation();
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const shopId = "demo-shop-1";
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: customers, isLoading } = useQuery({
    queryKey: ["/api/customers/shop", shopId],
  });

  const form = useForm({
    resolver: zodResolver(insertCustomerSchema.extend({
      email: insertCustomerSchema.shape.email.optional(),
    })),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      loyaltyPoints: 0,
      shopId,
    },
  });

  const addCustomerMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/customers", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers/shop", shopId] });
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: language === "hi" ? "ग्राहक जोड़ा गया!" : "Customer Added!",
        description: language === "hi" ? "नया ग्राहक सफलतापूर्वक जोड़ा गया।" : "New customer added successfully.",
      });
    },
    onError: () => {
      toast({
        title: language === "hi" ? "त्रुटि" : "Error",
        description: language === "hi" ? "ग्राहक जोड़ने में समस्या हुई।" : "Failed to add customer.",
        variant: "destructive",
      });
    },
  });

  const filteredCustomers = customers?.filter((customer: any) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  ) || [];

  const onSubmit = (data: any) => {
    addCustomerMutation.mutate(data);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "hi" : "en");
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen shadow-xl">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 shadow-md">
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
                {language === "hi" ? "ग्राहक प्रबंधन" : "Customer Management"}
              </h1>
              <p className="text-sm opacity-90">
                {filteredCustomers.length} {language === "hi" ? "ग्राहक" : "customers"}
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
        {/* Search and Add */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={language === "hi" ? "ग्राहक खोजें..." : "Search customers..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-customers"
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-add-customer">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>
                  {language === "hi" ? "नया ग्राहक जोड़ें" : "Add New Customer"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {language === "hi" ? "नाम" : "Name"}
                        </FormLabel>
                        <FormControl>
                          <Input placeholder={language === "hi" ? "ग्राहक का नाम" : "Customer name"} {...field} data-testid="input-customer-name" />
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
                        <FormLabel>
                          {language === "hi" ? "फोन नंबर" : "Phone Number"}
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="+91-9876543210" {...field} data-testid="input-customer-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {language === "hi" ? "ईमेल (वैकल्पिक)" : "Email (Optional)"}
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="customer@email.com" {...field} data-testid="input-customer-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={addCustomerMutation.isPending} data-testid="button-submit-customer">
                    {addCustomerMutation.isPending ? 
                      (language === "hi" ? "जोड़ा जा रहा है..." : "Adding...") : 
                      (language === "hi" ? "ग्राहक जोड़ें" : "Add Customer")
                    }
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">
              {language === "hi" ? "सभी" : "All"}
            </TabsTrigger>
            <TabsTrigger value="loyal">
              {language === "hi" ? "वफादार" : "Loyal"}
            </TabsTrigger>
            <TabsTrigger value="recent">
              {language === "hi" ? "हाल के" : "Recent"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <div className="space-y-3">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">
                  {language === "hi" ? "लोड हो रहा है..." : "Loading..."}
                </div>
              ) : filteredCustomers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {language === "hi" ? "कोई ग्राहक नहीं मिला" : "No customers found"}
                </div>
              ) : (
                filteredCustomers.map((customer: any) => (
                  <Card key={customer.id} className="hover:shadow-md transition-shadow" data-testid={`card-customer-${customer.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                          {customer.name}
                        </h3>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          <Gift className="w-3 h-3 mr-1" />
                          {customer.loyaltyPoints || 0} {language === "hi" ? "पॉइंट्स" : "points"}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 space-x-4">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {customer.phone}
                        </div>
                        {customer.email && (
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {customer.email}
                          </div>
                        )}
                      </div>
                      {customer.lastPurchase && (
                        <p className="text-xs text-gray-500 mt-2">
                          {language === "hi" ? "अंतिम खरीदारी: " : "Last purchase: "}
                          {new Date(customer.lastPurchase).toLocaleDateString('en-IN')}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="loyal" className="mt-4">
            <div className="space-y-3">
              {filteredCustomers
                .filter((customer: any) => (customer.loyaltyPoints || 0) >= 100)
                .map((customer: any) => (
                  <Card key={customer.id} className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20" data-testid={`card-loyal-customer-${customer.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                          {customer.name}
                        </h3>
                        <Badge className="bg-yellow-500 text-white">
                          <Gift className="w-3 h-3 mr-1" />
                          {customer.loyaltyPoints || 0} {language === "hi" ? "पॉइंट्स" : "points"}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="w-4 h-4 mr-1" />
                        {customer.phone}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="mt-4">
            <div className="space-y-3">
              {filteredCustomers
                .filter((customer: any) => {
                  if (!customer.lastPurchase) return false;
                  const lastPurchase = new Date(customer.lastPurchase);
                  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                  return lastPurchase > thirtyDaysAgo;
                })
                .map((customer: any) => (
                  <Card key={customer.id} className="border-green-200 bg-green-50 dark:bg-green-900/20" data-testid={`card-recent-customer-${customer.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                          {customer.name}
                        </h3>
                        <Badge className="bg-green-500 text-white">
                          {language === "hi" ? "हाल में" : "Recent"}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="w-4 h-4 mr-1" />
                        {customer.phone}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {language === "hi" ? "अंतिम खरीदारी: " : "Last purchase: "}
                        {new Date(customer.lastPurchase).toLocaleDateString('en-IN')}
                      </p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation language={language} />
    </div>
  );
}
