import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
}

export function SearchBar({
  placeholder = "Search by state, city, or terminal...",
  value = "",
  onChange,
  onSearch,
}: SearchBarProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="relative w-full">
      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-700" />

      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyPress={handleKeyPress}
        className="pl-12 pr-4 py-6 text-lg bg-white border-2 border-blue-300 focus:border-blue-700 rounded-xl shadow-sm text-blue-900 placeholder:text-blue-500"
      />
    </div>
  );
}
