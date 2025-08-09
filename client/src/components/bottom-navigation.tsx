import { useLocation } from "wouter";
import { Home, Megaphone, Users, BarChart3, User } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Home", labelHi: "होम" },
  { path: "/marketing", icon: Megaphone, label: "Marketing", labelHi: "मार्केटिंग" },
  { path: "/customers", icon: Users, label: "Customers", labelHi: "ग्राहक" },
  { path: "/analytics", icon: BarChart3, label: "Analytics", labelHi: "विश्लेषण" },
  { path: "/profile", icon: User, label: "Profile", labelHi: "प्रोफ़ाइल" },
];

interface BottomNavigationProps {
  language: "en" | "hi";
}

export default function BottomNavigation({ language }: BottomNavigationProps) {
  const [location, setLocation] = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-2 z-50">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map(({ path, icon: Icon, label, labelHi }) => {
          const isActive = location === path;
          return (
            <button
              key={path}
              onClick={() => setLocation(path)}
              className={`flex flex-col items-center py-2 px-1 transition-colors ${
                isActive 
                  ? "text-saffron" 
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              data-testid={`nav-${path.slice(1) || 'home'}`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">
                {language === "hi" ? labelHi : label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
