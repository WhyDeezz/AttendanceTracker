
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`
        flex items-center justify-center
        w-35px h-35px rounded-full
        transition-colors duration-300
        ${isDark ? "bg-gray-800 text-yellow-400" : "bg-yellow-400 text-gray-800"}
        
      `}
      aria-label="Toggle theme"
    >
      {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  );
}
