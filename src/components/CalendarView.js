import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Card } from "./ui/card";
import { CheckCircle2, XCircle, HelpCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfWeek, addDays, subWeeks, addWeeks } from "date-fns";
export function CalendarWeeklyView({ courses, records, onToggleAttendance }) {
    const [selectedWeekStart, setSelectedWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const getWeekDates = () => Array.from({ length: 7 }).map((_, i) => addDays(selectedWeekStart, i));
    const getRecord = (courseId, date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        return records.find((r) => r.courseId === courseId && r.date === dateStr);
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case "present":
                return _jsx(CheckCircle2, { className: "h-4 w-4 text-green-600" });
            case "absent":
                return _jsx(XCircle, { className: "h-4 w-4 text-red-600" });
            case "nodata":
                return _jsx(HelpCircle, { className: "h-4 w-4 text-gray-400" });
            default:
                return null;
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case "present":
                return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
            case "absent":
                return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
            case "nodata":
                return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
            default:
                return "";
        }
    };
    const goToPreviousWeek = () => setSelectedWeekStart(subWeeks(selectedWeekStart, 1));
    const goToNextWeek = () => setSelectedWeekStart(addWeeks(selectedWeekStart, 1));
    return (_jsxs("div", { className: "space-y-6 text-sm sm:text-base", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2", children: [_jsx("h1", { className: "text-lg sm:text-xl font-semibold", children: "Weekly Timetable" }), _jsxs("div", { className: "flex items-center justify-between sm:justify-end gap-2", children: [_jsx("button", { onClick: goToPreviousWeek, className: "p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition", title: "Previous Week", children: _jsx(ChevronLeft, { className: "h-5 w-5" }) }), _jsxs("span", { className: "text-gray-600 dark:text-gray-400 font-medium text-sm sm:text-base", children: [format(selectedWeekStart, "MMM d"), " - ", format(addDays(selectedWeekStart, 6), "MMM d, yyyy")] }), _jsx("button", { onClick: goToNextWeek, className: "p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition", title: "Next Week", children: _jsx(ChevronRight, { className: "h-5 w-5" }) })] })] }), _jsx(Card, { className: "overflow-x-auto rounded-2xl shadow-sm", children: _jsxs("table", { className: "w-full border-collapse text-xs sm:text-sm", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "w-1/6 border p-2 sticky left-0 bg-white dark:bg-gray-900", children: "Course" }), getWeekDates().map((date, i) => {
                                        const isWeekend = i >= 5; // Saturday (5) or Sunday (6)
                                        return (_jsx("th", { className: `border p-2 text-center ${isWeekend ? "hidden sm:table-cell" : ""}`, children: format(date, "EEE dd/MM") }, date.toString()));
                                    })] }) }), _jsx("tbody", { children: courses.map((course) => (_jsxs("tr", { className: "text-sm", children: [_jsxs("td", { className: "border p-2 flex items-center gap-2 sticky left-0 bg-white dark:bg-gray-900", children: [_jsx("span", { className: "w-3 h-3 rounded-full flex-shrink-0", style: { backgroundColor: course.color } }), _jsx("span", { className: "truncate", children: course.name })] }), getWeekDates().map((date, i) => {
                                        const isWeekend = i >= 5;
                                        const record = getRecord(course.id, date);
                                        return (_jsx("td", { className: `border p-1 text-center ${isWeekend ? "hidden sm:table-cell" : ""}`, children: record ? (_jsx("button", { onClick: () => onToggleAttendance(record.id), className: `flex items-center justify-center w-full px-2 py-1 rounded ${getStatusColor(record.status)} hover:opacity-80 transition`, children: getStatusIcon(record.status) })) : (_jsx("span", { className: "text-gray-300", children: "\u2014" })) }, date.toString()));
                                    })] }, course.id))) })] }) })] }));
}
