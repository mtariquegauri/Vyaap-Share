import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Copy, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface WhatsAppToolProps {
  shopType: string;
  shopId: string;
  language: "en" | "hi";
}

export default function WhatsAppTool({ shopType, shopId, language }: WhatsAppToolProps) {
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/whatsapp/generate", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedMessage(data.message);
      setSuggestions(data.suggestions || []);
      toast({
        title: language === "hi" ? "संदेश तैयार!" : "Message Generated!",
        description: language === "hi" ? "आपका WhatsApp संदेश तैयार हो गया है।" : "Your WhatsApp message is ready to use.",
      });
    },
    onError: () => {
      toast({
        title: language === "hi" ? "त्रुटि" : "Error",
        description: language === "hi" ? "संदेश बनाने में समस्या हुई।" : "Failed to generate message.",
        variant: "destructive",
      });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/whatsapp/save", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: language === "hi" ? "संदेश सहेजा गया!" : "Message Saved!",
        description: language === "hi" ? "संदेश आपके इतिहास में सहेज दिया गया है।" : "Message saved to your history.",
      });
    },
  });

  const handleGenerate = () => {
    generateMutation.mutate({
      shopType,
      occasion: selectedOccasion,
      language: language === "hi" ? "hindi" : "hinglish",
      customPrompt,
    });
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: language === "hi" ? "कॉपी हो गया!" : "Copied!",
        description: language === "hi" ? "संदेश कॉपी हो गया है।" : "Message copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: language === "hi" ? "त्रुटि" : "Error",
        description: language === "hi" ? "कॉपी नहीं हो सका।" : "Failed to copy message.",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    if (!generatedMessage) return;
    
    saveMutation.mutate({
      message: generatedMessage,
      language: language === "hi" ? "hindi" : "hinglish",
      occasion: selectedOccasion,
      shopType,
      shopId,
    });
  };

  const occasions = [
    { value: "diwali", label: language === "hi" ? "दिवाली" : "Diwali" },
    { value: "holi", label: language === "hi" ? "होली" : "Holi" },
    { value: "eid", label: language === "hi" ? "ईद" : "Eid" },
    { value: "raksha-bandhan", label: language === "hi" ? "रक्षा बंधन" : "Raksha Bandhan" },
    { value: "karva-chauth", label: language === "hi" ? "करवा चौथ" : "Karva Chauth" },
    { value: "navratri", label: language === "hi" ? "नवरात्रि" : "Navratri" },
    { value: "sale", label: language === "hi" ? "सेल" : "Sale" },
    { value: "general", label: language === "hi" ? "सामान्य" : "General" },
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-indian-green flex items-center gap-2">
          <Send className="w-5 h-5" />
          {language === "hi" ? "WhatsApp संदेश जेनरेटर" : "WhatsApp Message Generator"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="occasion">
            {language === "hi" ? "अवसर चुनें" : "Select Occasion"}
          </Label>
          <Select value={selectedOccasion} onValueChange={setSelectedOccasion}>
            <SelectTrigger data-testid="select-occasion">
              <SelectValue placeholder={language === "hi" ? "अवसर चुनें..." : "Choose occasion..."} />
            </SelectTrigger>
            <SelectContent>
              {occasions.map((occasion) => (
                <SelectItem key={occasion.value} value={occasion.value}>
                  {occasion.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="custom-prompt">
            {language === "hi" ? "अतिरिक्त जानकारी (वैकल्पिक)" : "Additional Details (Optional)"}
          </Label>
          <Textarea
            id="custom-prompt"
            placeholder={language === "hi" ? "जैसे: 20% छूट, नए उत्पाद, आदि..." : "e.g., 20% discount, new products, etc..."}
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            data-testid="textarea-custom-prompt"
          />
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={generateMutation.isPending}
          className="w-full bg-indian-green hover:bg-indian-green/90 text-white"
          data-testid="button-generate-message"
        >
          {generateMutation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : null}
          {language === "hi" ? "संदेश बनाएं" : "Generate Message"}
        </Button>

        {generatedMessage && (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-green-800 dark:text-green-200">
                  {language === "hi" ? "तैयार संदेश:" : "Generated Message:"}
                </h3>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleCopy(generatedMessage)}
                    data-testid="button-copy-message"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    {language === "hi" ? "कॉपी" : "Copy"}
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSave}
                    disabled={saveMutation.isPending}
                    data-testid="button-save-message"
                  >
                    {saveMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : null}
                    {language === "hi" ? "सहेजें" : "Save"}
                  </Button>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap" data-testid="text-generated-message">
                {generatedMessage}
              </p>
            </div>

            {suggestions.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                  {language === "hi" ? "अन्य विकल्प:" : "Alternative Options:"}
                </h3>
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-700 dark:text-gray-300 flex-1" data-testid={`text-suggestion-${index}`}>
                        {suggestion}
                      </p>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleCopy(suggestion)}
                        data-testid={`button-copy-suggestion-${index}`}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
