import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { MoreVertical, Calendar } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "./ui/dropdown-menu";
const DAY_SHORT = {
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
    Sunday: "Sun",
};
export function CourseCard({ name, color, percentage, classTimes, onView, onEdit, onDelete, }) {
    // Sort class times by day order
    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const sortedClassTimes = [...classTimes].sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));
    const totalSessions = classTimes.reduce((sum, ct) => sum + ct.sessions, 0);
    return (_jsxs(Card, { className: "p-5 hover:shadow-lg transition-all duration-300 cursor-pointer group", onClick: onView, children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: color } }), _jsx("h3", { className: "group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors", children: name })] }), _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, onClick: (e) => e.stopPropagation(), children: _jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", children: _jsx(MoreVertical, { className: "h-4 w-4" }) }) }), _jsxs(DropdownMenuContent, { align: "end", children: [_jsx(DropdownMenuItem, { onClick: (e) => {
                                            e.stopPropagation();
                                            onEdit();
                                        }, children: "Edit" }), _jsx(DropdownMenuItem, { onClick: (e) => {
                                            e.stopPropagation();
                                            onDelete();
                                        }, className: "text-red-600", children: "Delete" })] })] })] }), _jsxs("div", { className: "mb-4 space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400", children: [_jsx(Calendar, { className: "h-3 w-3" }), _jsxs("span", { children: [totalSessions, " session", totalSessions !== 1 ? 's' : '', " per week"] })] }), _jsx("div", { className: "flex flex-wrap gap-1", children: sortedClassTimes.map((ct, index) => (_jsxs(Badge, { variant: "outline", className: "text-xs", children: [DAY_SHORT[ct.day], " (", ct.sessions, ")"] }, index))) })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Attendance" }), _jsxs("span", { className: percentage >= 75 ? "text-green-600" : "text-red-600", children: [percentage.toFixed(1), "%"] })] }), _jsx(Progress, { value: percentage, className: "h-2" })] })] }));
}
