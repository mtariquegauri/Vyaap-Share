import { Button } from "@/components/ui/button";

interface LanguageToggleProps {
  language: "en" | "hi";
  onToggle: () => void;
}

export default function LanguageToggle({ language, onToggle }: LanguageToggleProps) {
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={onToggle}
      className="bg-white/20 hover:bg-white/30 text-white border-0 text-sm font-medium"
      data-testid="button-language-toggle"
    >
      {language === "en" ? "हिं" : "EN"}
    </Button>
  );
}
