import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ArrowLeft, CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { format } from "date-fns";
export function CourseDetail({ course, records, onBack, onToggleAttendance, }) {
    const courseRecords = records.filter((r) => r.courseId === course.id);
    const presentCount = courseRecords.filter((r) => r.status === "present").length;
    const totalCount = courseRecords.filter((r) => r.status !== "nodata").length;
    const percentage = totalCount > 0 ? (presentCount / totalCount) * 100 : 0;
    // Group records by date
    const recordsByDate = courseRecords.reduce((acc, record) => {
        if (!acc[record.date]) {
            acc[record.date] = [];
        }
        acc[record.date].push(record);
        return acc;
    }, {});
    // Sort dates in descending order
    const sortedDates = Object.keys(recordsByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
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
    const getStatusLabel = (status) => {
        switch (status) {
            case "present":
                return "Present";
            case "absent":
                return "Absent";
            case "nodata":
                return "No Data";
            default:
                return status;
        }
    };
    return (_jsxs("div", { className: "space-y-6 animate-in fade-in duration-300", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: onBack, children: _jsx(ArrowLeft, { className: "h-5 w-5" }) }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-4 h-4 rounded-full", style: { backgroundColor: course.color } }), _jsx("h1", { children: course.name })] })] }), _jsx(Card, { className: "p-6", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between mb-2", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Attendance" }), _jsxs("span", { className: percentage >= 75 ? "text-green-600" : "text-red-600", children: [percentage.toFixed(1), "%"] })] }), _jsx(Progress, { value: percentage, className: "h-3" })] }), _jsxs("div", { className: "grid grid-cols-3 gap-4 pt-4 border-t", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Total Sessions" }), _jsx("p", { className: "text-2xl", children: totalCount })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Attended" }), _jsx("p", { className: "text-2xl text-green-600", children: presentCount })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Missed" }), _jsx("p", { className: "text-2xl text-red-600", children: totalCount - presentCount })] })] })] }) }), _jsxs(Card, { className: "p-6", children: [_jsx("h2", { className: "mb-4", children: "Attendance History" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-4", children: "Click on any session to toggle between Present \u2192 Absent \u2192 No Data" }), sortedDates.length === 0 ? (_jsx("p", { className: "text-center text-gray-500 py-8", children: "No attendance records yet" })) : (_jsx("div", { className: "space-y-3", children: sortedDates.map((date) => (_jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: format(new Date(date), "EEEE, MMMM d, yyyy") }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2", children: recordsByDate[date].map((record, index) => (_jsxs("button", { onClick: () => onToggleAttendance(record.id), className: "flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer", children: [_jsxs("div", { className: "flex items-center gap-2", children: [getStatusIcon(record.status), _jsxs("span", { className: "text-sm", children: ["Session ", index + 1] })] }), _jsx(Badge, { className: getStatusColor(record.status), children: getStatusLabel(record.status) })] }, record.id))) })] }, date))) }))] })] }));
}
