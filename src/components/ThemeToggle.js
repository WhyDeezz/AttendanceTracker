import { jsx as _jsx } from "react/jsx-runtime";
import { Moon, Sun } from "lucide-react";
export function ThemeToggle({ isDark, onToggle }) {
    return (_jsx("button", { onClick: onToggle, className: `
        flex items-center justify-center
        w-35px h-35px rounded-full
        transition-colors duration-300
        ${isDark ? "bg-gray-800 text-yellow-400" : "bg-yellow-400 text-gray-800"}
        
      `, "aria-label": "Toggle theme", children: isDark ? _jsx(Moon, { className: "h-5 w-5" }) : _jsx(Sun, { className: "h-5 w-5" }) }));
}
