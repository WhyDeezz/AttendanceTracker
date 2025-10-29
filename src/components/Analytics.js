import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from "./ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { subDays, startOfWeek, endOfWeek } from "date-fns";
export function Analytics({ course, records }) {
    const getCourseStats = (courseId) => {
        const courseRecords = records.filter((r) => r.courseId === courseId);
        const presentCount = courseRecords.filter((r) => r.status === "present").length;
        const totalCount = courseRecords.filter((r) => r.status !== "nodata").length;
        const percentage = totalCount > 0 ? (presentCount / totalCount) * 100 : 0;
        // Get last week's stats for trend
        const lastWeekStart = startOfWeek(subDays(new Date(), 7));
        const lastWeekEnd = endOfWeek(subDays(new Date(), 7));
        const lastWeekRecords = courseRecords.filter((r) => {
            const recordDate = new Date(r.date);
            return recordDate >= lastWeekStart && recordDate <= lastWeekEnd;
        });
        const lastWeekPresent = lastWeekRecords.filter((r) => r.status === "present").length;
        const lastWeekTotal = lastWeekRecords.filter((r) => r.status !== "nodata").length;
        const lastWeekPercentage = lastWeekTotal > 0 ? (lastWeekPresent / lastWeekTotal) * 100 : 0;
        const trend = percentage - lastWeekPercentage;
        return {
            percentage,
            presentCount,
            totalCount,
            trend,
        };
    };
    const getTrendIcon = (trend) => {
        if (trend > 0)
            return _jsx(TrendingUp, { className: "h-4 w-4 text-green-600" });
        if (trend < 0)
            return _jsx(TrendingDown, { className: "h-4 w-4 text-red-600" });
        return _jsx(Minus, { className: "h-4 w-4 text-gray-600" });
    };
    const getTrendText = (trend) => {
        if (trend > 0)
            return `+${trend.toFixed(1)}% from last week`;
        if (trend < 0)
            return `${trend.toFixed(1)}% from last week`;
        return "No change from last week";
    };
    return (_jsx("div", { className: "space-y-6 animate-in fade-in duration-300", children: _jsxs("div", { children: [_jsx("h2", { className: "mb-4 text-xl", children: "Course-wise Performance" }), _jsxs(Card, { className: "p-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: course.color } }), _jsx("h3", { children: course.name })] }), _jsx("div", { className: "flex flex-col items-center justify-center mb-6", children: _jsxs("div", { className: "relative w-32 h-32", children: [_jsxs("svg", { className: "transform -rotate-90 w-32 h-32", children: [_jsx("circle", { cx: "64", cy: "64", r: "56", stroke: "currentColor", strokeWidth: "10", fill: "transparent", className: "text-gray-200 dark:text-gray-700" }), _jsx("circle", { cx: "64", cy: "64", r: "56", stroke: "currentColor", strokeWidth: "10", fill: "transparent", strokeDasharray: `${2 * Math.PI * 56}`, strokeDashoffset: `${2 * Math.PI * 56 * (1 - getCourseStats(course.id).percentage / 100)}`, className: getCourseStats(course.id).percentage >= 75 ? "text-green-600" : "text-red-600", strokeLinecap: "round" })] }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center flex-col", children: _jsxs("span", { className: "text-2xl", children: [getCourseStats(course.id).percentage.toFixed(1), "%"] }) })] }) }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400", children: [getTrendIcon(getCourseStats(course.id).trend), _jsx("span", { children: getTrendText(getCourseStats(course.id).trend) })] }), _jsxs("div", { className: "pt-3 border-t grid grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-1", children: "Attended" }), _jsx("p", { className: "text-xl text-green-600", children: getCourseStats(course.id).presentCount })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-1", children: "Total Sessions" }), _jsx("p", { className: "text-xl", children: getCourseStats(course.id).totalCount })] })] })] })] }, course.id)] }) }));
}
