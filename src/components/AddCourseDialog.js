import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const COLORS = [
    "#3B82F6", // blue
    "#10B981", // green
    "#F59E0B", // amber
    "#EF4444", // red
    "#8B5CF6", // purple
    "#EC4899", // pink
    "#06B6D4", // cyan
];
export function AddCourseDialog({ open, onOpenChange, onSave, editCourse, }) {
    const [courseName, setCourseName] = useState("");
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [schedule, setSchedule] = useState({
        Monday: { enabled: false, sessions: 1 },
        Tuesday: { enabled: false, sessions: 1 },
        Wednesday: { enabled: false, sessions: 1 },
        Thursday: { enabled: false, sessions: 1 },
        Friday: { enabled: false, sessions: 1 },
    });
    useEffect(() => {
        if (editCourse) {
            setCourseName(editCourse.name);
            setSelectedColor(editCourse.color);
            // Convert classTimes array to schedule object
            const newSchedule = {
                Monday: { enabled: false, sessions: 1 },
                Tuesday: { enabled: false, sessions: 1 },
                Wednesday: { enabled: false, sessions: 1 },
                Thursday: { enabled: false, sessions: 1 },
                Friday: { enabled: false, sessions: 1 },
            };
            editCourse.classTimes.forEach((ct) => {
                if (newSchedule[ct.day]) {
                    newSchedule[ct.day] = { enabled: true, sessions: ct.sessions };
                }
            });
            setSchedule(newSchedule);
        }
        else {
            setCourseName("");
            setSelectedColor(COLORS[0]);
            setSchedule({
                Monday: { enabled: false, sessions: 1 },
                Tuesday: { enabled: false, sessions: 1 },
                Wednesday: { enabled: false, sessions: 1 },
                Thursday: { enabled: false, sessions: 1 },
                Friday: { enabled: false, sessions: 1 },
            });
        }
    }, [editCourse, open]);
    const handleToggleDay = (day, checked) => {
        setSchedule({
            ...schedule,
            [day]: { ...schedule[day], enabled: checked },
        });
    };
    const handleSessionsChange = (day, sessions) => {
        const validSessions = Math.max(1, Math.min(5, sessions)); // Between 1-5 sessions
        setSchedule({
            ...schedule,
            [day]: { ...schedule[day], sessions: validSessions },
        });
    };
    const handleSubmit = () => {
        if (!courseName.trim())
            return;
        // Convert schedule object to classTimes array
        const classTimes = WEEKDAYS.filter((day) => schedule[day].enabled).map((day) => ({
            day,
            sessions: schedule[day].sessions,
        }));
        if (classTimes.length === 0)
            return;
        const courseData = {
            ...(editCourse ? { id: editCourse.id } : {}),
            name: courseName,
            classTimes,
            color: selectedColor,
        };
        onSave(courseData);
        onOpenChange(false);
    };
    const enabledDays = WEEKDAYS.filter((day) => schedule[day].enabled).length;
    const totalSessions = WEEKDAYS.reduce((sum, day) => {
        return sum + (schedule[day].enabled ? schedule[day].sessions : 0);
    }, 0);
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: editCourse ? "Edit Course" : "Add New Course" }), _jsx(DialogDescription, { children: editCourse
                                ? "Update your course details, schedule, and color."
                                : "Add a new course with weekly schedule and sessions per day." })] }), _jsxs("div", { className: "space-y-6 py-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Course Name" }), _jsx(Input, { placeholder: "e.g., Physics", value: courseName, onChange: (e) => setCourseName(e.target.value) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Course Color" }), _jsx("div", { className: "flex gap-2", children: COLORS.map((color) => (_jsx("button", { type: "button", className: `w-8 h-8 rounded-full transition-transform ${selectedColor === color
                                            ? "scale-125 ring-2 ring-offset-2 ring-gray-400"
                                            : ""}`, style: { backgroundColor: color }, onClick: () => setSelectedColor(color) }, color))) })] }), _jsxs("div", { className: "space-y-3", children: [_jsx(Label, { children: "Weekly Schedule (Monday - Friday)" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Select days and specify number of sessions per day" }), _jsx("div", { className: "space-y-3 border rounded-lg p-4", children: WEEKDAYS.map((day) => (_jsxs("div", { className: "flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800", children: [_jsx(Checkbox, { id: `day-${day}`, checked: schedule[day].enabled, onCheckedChange: (checked) => handleToggleDay(day, checked) }), _jsx(Label, { htmlFor: `day-${day}`, className: "flex-1 cursor-pointer", children: day }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Input, { type: "number", min: "1", max: "5", value: schedule[day].sessions, onChange: (e) => handleSessionsChange(day, parseInt(e.target.value) || 1), disabled: !schedule[day].enabled, className: "w-20" }), _jsxs("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["session", schedule[day].sessions !== 1 ? "s" : ""] })] })] }, day))) }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: enabledDays > 0
                                        ? `${totalSessions} total session${totalSessions !== 1 ? "s" : ""} per week across ${enabledDays} day${enabledDays !== 1 ? "s" : ""}`
                                        : "Please select at least one day" })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), children: "Cancel" }), _jsx(Button, { onClick: handleSubmit, disabled: !courseName.trim() || enabledDays === 0, children: editCourse ? "Save Changes" : "Add Course" })] })] }) }));
}
