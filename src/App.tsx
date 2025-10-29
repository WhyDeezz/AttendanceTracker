import { useState, useEffect} from "react";
import { Dashboard} from "./components/Dashboard";
import { CalendarWeeklyView} from "./components/CalendarView"; 
import { Analytics } from "./components/Analytics";
import { AddCourseDialog } from "./components/AddCourseDialog";
import supabase from "./supabaseClient";
import { useAuth } from "./AuthContext";
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "./components/ui/button"
import { Moon, Sun, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./components/ui/alert-dialog";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";
import { format, addDays, subDays, getDay } from "date-fns";


interface Course {
  id: string;
  name: string;
  color: string;
  classTimes: Array<{ day: string; sessions: number }>;
}

interface AttendanceRecord {
  id: string;
  courseId: string;
  date: string;
  status: "present" | "absent" | "nodata";
}

type View = "dashboard" | "course" | "calendar" | "analytics";

const DAY_MAPPING: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};


export default function App() {
  const navigate = useNavigate()
  const { signOutUser } = useAuth();
 
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [showAddCourseDialog, setShowAddCourseDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);

useEffect(() => {
  const loadData = async () => {
    const savedTheme = localStorage.getItem("attendanceTheme");
    if (savedTheme) setIsDarkMode(savedTheme === "dark");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUser({ email: user.email ?? "" });
    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .select("*")
      .eq("userId", user.id);
    if (courseError) console.error(courseError);
    else if (courseData) setCourses(courseData);

    
    const { data: recordData, error: recordError } = await supabase
      .from("attendanceRecords")
      .select("*")
      .eq("userId", user.id);
    if (recordError) console.error(recordError);
    else if (recordData) setRecords(recordData);
  };

  loadData();
}, []);


  useEffect(() => {
    if (courses.length === 0) return;

    const saveCourses = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const userCourses = courses.map((c) => ({
        ...c,
        userId: user.id,
      }));

      const { error } = await supabase.from("courses").upsert(userCourses);
      if (error) console.error("Error saving courses:", error);
    };

    saveCourses();
  }, [courses]);


  useEffect(() => {
    if (records.length === 0) return;

    const saveRecords = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const userRecords = records.map((r) => ({
        ...r,
        userId: user.id, 
      }));

      const { error } = await supabase.from("attendanceRecords").upsert(userRecords);
      if (error) console.error("Error saving attendance records:", error);
    };

    saveRecords();
  }, [records]);

  
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("attendanceTheme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("attendanceTheme", "light");
    }
  }, [isDarkMode]);
    const handleLogout = async () => {
    try {
      await signOutUser();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const generateRecordsForCourse = (course: Course) => {
    const newRecords: AttendanceRecord[] = [];
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

  const handleAddCourse = (courseData: Omit<Course, "id"> | Course) => {
    if ("id" in courseData) {
      setCourses(courses.map((c) => (c.id === courseData.id ? courseData : c)));
      toast.success("Course updated successfully!");
    } else {
      const newCourse: Course = { ...courseData, id: Date.now().toString() };
      setCourses([...courses, newCourse]);
      const newRecords = generateRecordsForCourse(newCourse);
      setRecords([...records, ...newRecords]);
      toast.success("Course added successfully!");
    }
    setEditingCourse(null);
  };

  const handleDeleteCourse = (courseId: string) => {
    setDeletingCourseId(courseId);
  };

const confirmDeleteCourse = async () => {
  if (!deletingCourseId) return;


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


  const handleToggleAttendance = (recordId: string) => {
    setRecords(
      records.map((r) => {
        if (r.id === recordId) {
          let newStatus: "present" | "absent" | "nodata";
          if (r.status === "nodata") newStatus = "present";
          else if (r.status === "present") newStatus = "absent";
          else newStatus = "nodata";
          return { ...r, status: newStatus };
        }
        return r;
      })
    );
  };


  const handleViewCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentView("course");
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setShowAddCourseDialog(true);
  };

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

 return (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <Toaster />

      <nav className="sticky top-0 z-50 border-b bg-white dark:bg-gray-800 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between relative">

  
            <button
              onClick={() => setCurrentView("dashboard")}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              {isDarkMode ? (
                <img src="./darkcar.png" width="50" alt="Dark car logo" />
              ) : (
                <img src="./lightcar.png" width="50" alt="Light car logo" />
              )}
            </button>

 
            <div>
              <h1>
                Attendance Tracker
                
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <User size={20} />
                  
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>{user?.email || "Guest"}</DropdownMenuLabel>
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>


    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {currentView === "dashboard" && (
        <Dashboard
          courses={courses}
          records={records}
          onAddCourse={() => {
            setEditingCourse(null);
            setShowAddCourseDialog(true);
          }}
          onViewAnalytics={() => setCurrentView("analytics")}
          onViewCalendar={() => setCurrentView("calendar")}
          onViewCourse={handleViewCourse}
          onEditCourse={handleEditCourse}
          onDeleteCourse={handleDeleteCourse}
        />
      )}

      {currentView === "course" && selectedCourse && (
        <Analytics course={selectedCourse} records={records} />
      )}

      {currentView === "calendar" && (
        <CalendarWeeklyView
          courses={courses}
          records={records}
          onToggleAttendance={handleToggleAttendance}
        />
      )}
    </div>

    {/* Add Course Dialog */}
    <AddCourseDialog
      open={showAddCourseDialog}
      onOpenChange={setShowAddCourseDialog}
      onSave={handleAddCourse}
      editCourse={editingCourse}
    />

    <AlertDialog
      open={!!deletingCourseId}
      onOpenChange={(open) => !open && setDeletingCourseId(null)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Course</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this course? This will also delete
            all attendance records for this course. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmDeleteCourse}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
);

}
