import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Dashboard } from "./components/Dashboard";
import { CalendarWeeklyView } from "./components/CalendarView";
import { Analytics } from "./components/Analytics";
import { AddCourseDialog } from "./components/AddCourseDialog";
import supabase from "./supabaseClient";
import { useAuth } from "./AuthContext";
import { useNavigate } from 'react-router-dom';
import { Button } from "./components/ui/button";
import { Moon, Sun, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, } from "./components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "./components/ui/alert-dialog";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";
import { format, addDays, subDays, getDay } from "date-fns";
const DAY_MAPPING = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
};
export default function App() {
    const navigate = useNavigate();
    const { signOutUser } = useAuth();
    const [user, setUser] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [courses, setCourses] = useState([]);
    const [records, setRecords] = useState([]);
    const [currentView, setCurrentView] = useState("dashboard");
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [showAddCourseDialog, setShowAddCourseDialog] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [deletingCourseId, setDeletingCourseId] = useState(null);
    useEffect(() => {
        const loadData = async () => {
            const savedTheme = localStorage.getItem("attendanceTheme");
            if (savedTheme)
                setIsDarkMode(savedTheme === "dark");
            const { data: { user } } = await supabase.auth.getUser();
            if (!user)
                return;
            setUser({ email: user.email ?? "" });
            const { data: courseData, error: courseError } = await supabase
                .from("courses")
                .select("*")
                .eq("userId", user.id);
            if (courseError)
                console.error(courseError);
            else if (courseData)
                setCourses(courseData);
            const { data: recordData, error: recordError } = await supabase
                .from("attendanceRecords")
                .select("*")
                .eq("userId", user.id);
            if (recordError)
                console.error(recordError);
            else if (recordData)
                setRecords(recordData);
        };
        loadData();
    }, []);
    useEffect(() => {
        if (courses.length === 0)
            return;
        const saveCourses = async () => {
            const { data: { user }, } = await supabase.auth.getUser();
            if (!user)
                return;
            const userCourses = courses.map((c) => ({
                ...c,
                userId: user.id,
            }));
            const { error } = await supabase.from("courses").upsert(userCourses);
            if (error)
                console.error("Error saving courses:", error);
        };
        saveCourses();
    }, [courses]);
    useEffect(() => {
        if (records.length === 0)
            return;
        const saveRecords = async () => {
            const { data: { user }, } = await supabase.auth.getUser();
            if (!user)
                return;
            const userRecords = records.map((r) => ({
                ...r,
                userId: user.id,
            }));
            const { error } = await supabase.from("attendanceRecords").upsert(userRecords);
            if (error)
                console.error("Error saving attendance records:", error);
        };
        saveRecords();
    }, [records]);
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("attendanceTheme", "dark");
        }
        else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("attendanceTheme", "light");
        }
    }, [isDarkMode]);
    const handleLogout = async () => {
        try {
            await signOutUser();
            navigate("/");
        }
        catch (err) {
            console.error("Logout failed:", err);
        }
    };
    const generateRecordsForCourse = (course) => {
        const newRecords = [];
        const today = new Date();
        const startDate = subDays(today, 90);
        const endDate = addDays(today, 90);
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dayOfWeek = getDay(currentDate);
            course.classTimes.forEach((classTime) => {
                if (DAY_MAPPING[classTime.day] === dayOfWeek) {
                    for (let i = 0; i < classTime.sessions; i++) {
                        newRecords.push({
                            id: `${Date.now()}-${currentDate.getTime()}-${i}`,
                            courseId: course.id,
                            date: format(currentDate, "yyyy-MM-dd"),
                            status: "nodata",
                        });
                    }
                }
            });
            currentDate = addDays(currentDate, 1);
        }
        return newRecords;
    };
    const handleAddCourse = (courseData) => {
        if ("id" in courseData) {
            setCourses(courses.map((c) => (c.id === courseData.id ? courseData : c)));
            toast.success("Course updated successfully!");
        }
        else {
            const newCourse = { ...courseData, id: Date.now().toString() };
            setCourses([...courses, newCourse]);
            const newRecords = generateRecordsForCourse(newCourse);
            setRecords([...records, ...newRecords]);
            toast.success("Course added successfully!");
        }
        setEditingCourse(null);
    };
    const handleDeleteCourse = (courseId) => {
        setDeletingCourseId(courseId);
    };
    const confirmDeleteCourse = async () => {
        if (!deletingCourseId)
            return;
        const { error: recordError } = await supabase
            .from("attendanceRecords")
            .delete()
            .eq("courseId", deletingCourseId);
        if (recordError) {
            console.error("Error deleting attendance records:", recordError);
            toast.error("Failed to delete attendance records");
            return;
        }
        const { error: courseError } = await supabase
            .from("courses")
            .delete()
            .eq("id", deletingCourseId);
        if (courseError) {
            console.error("Error deleting course:", courseError);
            toast.error("Failed to delete course");
            return;
        }
        setCourses(courses.filter(c => c.id !== deletingCourseId));
        setRecords(records.filter(r => r.courseId !== deletingCourseId));
        setDeletingCourseId(null);
        toast.success("Course and its attendance records deleted successfully!");
    };
    const handleToggleAttendance = (recordId) => {
        setRecords(records.map((r) => {
            if (r.id === recordId) {
                let newStatus;
                if (r.status === "nodata")
                    newStatus = "present";
                else if (r.status === "present")
                    newStatus = "absent";
                else
                    newStatus = "nodata";
                return { ...r, status: newStatus };
            }
            return r;
        }));
    };
    const handleViewCourse = (courseId) => {
        setSelectedCourseId(courseId);
        setCurrentView("course");
    };
    const handleEditCourse = (course) => {
        setEditingCourse(course);
        setShowAddCourseDialog(true);
    };
    const selectedCourse = courses.find((c) => c.id === selectedCourseId);
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300", children: [_jsx(Toaster, {}), _jsx("nav", { className: "sticky top-0 z-50 border-b bg-white dark:bg-gray-800 shadow-sm transition-colors duration-300", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5", children: _jsxs("div", { className: "flex items-center justify-between relative", children: [_jsx("button", { onClick: () => setCurrentView("dashboard"), className: "flex items-center hover:opacity-80 transition-opacity", children: isDarkMode ? (_jsx("img", { src: "./darkcar.png", width: "50", alt: "Dark car logo" })) : (_jsx("img", { src: "./lightcar.png", width: "50", alt: "Light car logo" })) }), _jsx("div", { children: _jsx("h1", { children: "Attendance Tracker" }) }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", className: "flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700", children: _jsx(User, { size: 20 }) }) }), _jsxs(DropdownMenuContent, { className: "w-56", align: "end", children: [_jsx(DropdownMenuLabel, { children: user?.email || "Guest" }), _jsx(DropdownMenuItem, { onClick: handleLogout, children: "Log out" })] })] }), _jsx("button", { onClick: () => setIsDarkMode(!isDarkMode), className: "p-2 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors", "aria-label": "Toggle theme", children: isDarkMode ? _jsx(Sun, { size: 20 }) : _jsx(Moon, { size: 20 }) })] })] }) }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [currentView === "dashboard" && (_jsx(Dashboard, { courses: courses, records: records, onAddCourse: () => {
                            setEditingCourse(null);
                            setShowAddCourseDialog(true);
                        }, onViewAnalytics: () => setCurrentView("analytics"), onViewCalendar: () => setCurrentView("calendar"), onViewCourse: handleViewCourse, onEditCourse: handleEditCourse, onDeleteCourse: handleDeleteCourse })), currentView === "course" && selectedCourse && (_jsx(Analytics, { course: selectedCourse, records: records })), currentView === "calendar" && (_jsx(CalendarWeeklyView, { courses: courses, records: records, onToggleAttendance: handleToggleAttendance }))] }), _jsx(AddCourseDialog, { open: showAddCourseDialog, onOpenChange: setShowAddCourseDialog, onSave: handleAddCourse, editCourse: editingCourse }), _jsx(AlertDialog, { open: !!deletingCourseId, onOpenChange: (open) => !open && setDeletingCourseId(null), children: _jsxs(AlertDialogContent, { children: [_jsxs(AlertDialogHeader, { children: [_jsx(AlertDialogTitle, { children: "Delete Course" }), _jsx(AlertDialogDescription, { children: "Are you sure you want to delete this course? This will also delete all attendance records for this course. This action cannot be undone." })] }), _jsxs(AlertDialogFooter, { children: [_jsx(AlertDialogCancel, { children: "Cancel" }), _jsx(AlertDialogAction, { onClick: confirmDeleteCourse, className: "bg-red-600 hover:bg-red-700", children: "Delete" })] })] }) })] }));
}
