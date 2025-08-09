import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Palette, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface BannerToolProps {
  shopType: string;
  shopId: string;
  language: "en" | "hi";
}

export default function BannerTool({ shopType, shopId, language }: BannerToolProps) {
  const [selectedFestival, setSelectedFestival] = useState("");
  const [customText, setCustomText] = useState("");
  const [bannerContent, setBannerContent] = useState<any>(null);
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/banners/generate", data);
      return response.json();
    },
    onSuccess: (data) => {
      setBannerContent(data);
      toast({
        title: language === "hi" ? "बैनर तैयार!" : "Banner Generated!",
        description: language === "hi" ? "आपका बैनर तैयार हो गया है।" : "Your banner is ready to use.",
      });
    },
    onError: () => {
      toast({
        title: language === "hi" ? "त्रुटि" : "Error",
        description: language === "hi" ? "बैनर बनाने में समस्या हुई।" : "Failed to generate banner.",
        variant: "destructive",
      });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/banners/save", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: language === "hi" ? "बैनर सहेजा गया!" : "Banner Saved!",
        description: language === "hi" ? "बैनर आपके संग्रह में सहेज दिया गया है।" : "Banner saved to your collection.",
      });
    },
  });

  const handleGenerate = () => {
    generateMutation.mutate({
      festival: selectedFestival,
      shopType,
      customText,
    });
  };

  const handleSave = () => {
    if (!bannerContent) return;
    
    saveMutation.mutate({
      title: bannerContent.title,
      festival: selectedFestival,
      template: "ai-generated",
      customText,
      colors: bannerContent.colors,
      shopId,
    });
  };

  const festivals = [
    { value: "diwali", label: language === "hi" ? "दिवाली" : "Diwali" },
    { value: "holi", label: language === "hi" ? "होली" : "Holi" },
    { value: "eid", label: language === "hi" ? "ईद" : "Eid" },
    { value: "raksha-bandhan", label: language === "hi" ? "रक्षा बंधन" : "Raksha Bandhan" },
    { value: "karva-chauth", label: language === "hi" ? "करवा चौथ" : "Karva Chauth" },
    { value: "navratri", label: language === "hi" ? "नवरात्रि" : "Navratri" },
    { value: "ganesh-chaturthi", label: language === "hi" ? "गणेश चतुर्थी" : "Ganesh Chaturthi" },
    { value: "durga-puja", label: language === "hi" ? "दुर्गा पूजा" : "Durga Puja" },
    { value: "christmas", label: language === "hi" ? "क्रिसमस" : "Christmas" },
    { value: "new-year", label: language === "hi" ? "नया साल" : "New Year" },
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-festival-orange flex items-center gap-2">
          <Palette className="w-5 h-5" />
          {language === "hi" ? "त्योहारी बैनर मेकर" : "Festival Banner Maker"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="festival">
            {language === "hi" ? "त्योहार चुनें" : "Select Festival"}
          </Label>
          <Select value={selectedFestival} onValueChange={setSelectedFestival}>
            <SelectTrigger data-testid="select-festival">
              <SelectValue placeholder={language === "hi" ? "त्योहार चुनें..." : "Choose festival..."} />
            </SelectTrigger>
            <SelectContent>
              {festivals.map((festival) => (
                <SelectItem key={festival.value} value={festival.value}>
                  {festival.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="custom-text">
            {language === "hi" ? "कस्टम टेक्स्ट (वैकल्पिक)" : "Custom Text (Optional)"}
          </Label>
          <Input
            id="custom-text"
            placeholder={language === "hi" ? "जैसे: विशेष छूट, दुकान का नाम..." : "e.g., Special Discount, Shop Name..."}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            data-testid="input-custom-text"
          />
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={generateMutation.isPending}
          className="w-full bg-festival-orange hover:bg-festival-orange/90 text-white"
          data-testid="button-generate-banner"
        >
          {generateMutation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : null}
          {language === "hi" ? "बैनर बनाएं" : "Generate Banner"}
        </Button>

        {bannerContent && (
          <div className="space-y-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gradient-to-r from-festival-orange to-indian-red text-white">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold" data-testid="text-banner-title">
                  {bannerContent.title}
                </h2>
                <p className="text-lg" data-testid="text-banner-subtitle">
                  {bannerContent.subtitle}
                </p>
                {customText && (
                  <p className="text-sm bg-white/20 rounded px-2 py-1 inline-block">
                    {customText}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-2">
                {language === "hi" ? "डिज़ाइन जानकारी:" : "Design Details:"}
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">
                    {language === "hi" ? "रंग पैलेट:" : "Color Palette:"}
                  </span>
                  <div className="flex gap-2 mt-1">
                    {bannerContent.colors?.map((color: string, index: number) => (
                      <div 
                        key={index}
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
                {bannerContent.elements && (
                  <div>
                    <span className="font-medium">
                      {language === "hi" ? "डिज़ाइन तत्व:" : "Design Elements:"}
                    </span>
                    <ul className="list-disc list-inside mt-1">
                      {bannerContent.elements.map((element: string, index: number) => (
                        <li key={index} className="text-gray-600 dark:text-gray-400">
                          {element}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="flex-1"
                data-testid="button-save-banner"
              >
                {saveMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : null}
                {language === "hi" ? "सहेजें" : "Save"}
              </Button>
              <Button 
                variant="outline"
                onClick={() => toast({
                  title: language === "hi" ? "डाउनलोड" : "Download",
                  description: language === "hi" ? "डाउनलोड सुविधा जल्द उपलब्ध होगी।" : "Download feature coming soon.",
                })}
                data-testid="button-download-banner"
              >
                <Download className="w-4 h-4 mr-1" />
                {language === "hi" ? "डाउनलोड" : "Download"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
