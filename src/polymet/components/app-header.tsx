import { FuelIcon } from "lucide-react";
import { APP_CONFIG } from "@/config/constants";

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
}

export function AppHeader({
  title = APP_CONFIG.title,
  subtitle = APP_CONFIG.subtitle,
}: AppHeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-950 to-blue-900 border-b border-blue-800">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-800 rounded-xl flex items-center justify-center shadow-lg">
            <FuelIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="text-sm text-blue-200">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
