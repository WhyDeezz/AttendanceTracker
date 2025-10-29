import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { CourseCard } from "./CourseCard";
import { StatsWidget } from "./StatsWidget";
import { startOfWeek, endOfWeek, isWithinInterval } from "date-fns";
export function Dashboard({ courses, records, onAddCourse, onViewCalendar, onViewCourse, onEditCourse, onDeleteCourse, }) {
    const getCoursePercentage = (courseId) => {
        const courseRecords = records.filter((r) => r.courseId === courseId);
        const presentCount = courseRecords.filter((r) => r.status === "present").length;
        const totalCount = courseRecords.filter((r) => r.status !== "nodata").length;
        return totalCount > 0 ? (presentCount / totalCount) * 100 : 0;
    };
    const getWeeklyStats = () => {
        const now = new Date();
        const weekStart = startOfWeek(now);
        const weekEnd = endOfWeek(now);
        const weekRecords = records.filter((r) => {
            const recordDate = new Date(r.date);
            return isWithinInterval(recordDate, { start: weekStart, end: weekEnd });
        });
        const attended = weekRecords.filter((r) => r.status === "present").length;
        const missed = weekRecords.filter((r) => r.status === "absent").length;
        const total = weekRecords.filter((r) => r.status !== "nodata").length;
        return { attended, missed, total };
    };
    const weeklyStats = getWeeklyStats();
    return (_jsxs("div", { className: "space-y-6 animate-in fade-in duration-300", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "mb-2", children: "TrackYourClawses" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Track your classes and monitor your attendance" })] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsxs(Button, { onClick: onAddCourse, children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Add Course"] }), _jsxs(Button, { variant: "outline", onClick: onViewCalendar, children: [_jsx(CalendarIcon, { className: "h-4 w-4 mr-2" }), "Calendar"] })] })] }), _jsxs("div", { children: [_jsx("h2", { className: "mb-4", children: "This Week's Stats" }), _jsx(StatsWidget, { attended: weeklyStats.attended, missed: weeklyStats.missed, total: weeklyStats.total })] }), _jsxs("div", { children: [_jsx("h2", { className: "mb-4", children: "Your Courses" }), courses.length === 0 ? (_jsx(Card, { className: "p-12 text-center", children: _jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "text-gray-400", children: _jsx(CalendarIcon, { className: "h-16 w-16 mx-auto mb-4" }) }), _jsxs("div", { children: [_jsx("h3", { className: "mb-2", children: "No courses yet" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-4", children: "Get started by adding your first course" }), _jsxs(Button, { onClick: onAddCourse, children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Add Your First Course"] })] })] }) })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: courses.map((course) => (_jsx(CourseCard, { id: course.id, name: course.name, color: course.color, percentage: getCoursePercentage(course.id), classTimes: course.classTimes, onView: () => onViewCourse(course.id), onEdit: () => onEditCourse(course), onDelete: () => onDeleteCourse(course.id) }, course.id))) }))] })] }));
}
