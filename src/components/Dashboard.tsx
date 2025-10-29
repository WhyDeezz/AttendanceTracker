import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { CourseCard } from "./CourseCard";
import { StatsWidget } from "./StatsWidget";
import { startOfWeek, endOfWeek, isWithinInterval } from "date-fns";

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

interface DashboardProps {
  courses: Course[];
  records: AttendanceRecord[];
  onAddCourse: () => void;
  onViewAnalytics: () => void;
  onViewCalendar: () => void;
  onViewCourse: (courseId: string) => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
}

export function Dashboard({
  courses,
  records,
  onAddCourse,

  onViewCalendar,
  onViewCourse,
  onEditCourse,
  onDeleteCourse,
}: DashboardProps) {
  const getCoursePercentage = (courseId: string) => {
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="mb-2">TrackYourClawses</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your classes and monitor your attendance
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={onAddCourse}>
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
 
          <Button variant="outline" onClick={onViewCalendar}>
            <CalendarIcon className="h-4 w-4 mr-2" />
            Calendar
          </Button>
        </div>
      </div>

      <div>
        <h2 className="mb-4">This Week's Stats</h2>
        <StatsWidget
          attended={weeklyStats.attended}
          missed={weeklyStats.missed}
          total={weeklyStats.total}
        />
      </div>

      <div>
        <h2 className="mb-4">Your Courses</h2>
        {courses.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="space-y-4">
              <div className="text-gray-400">
                <CalendarIcon className="h-16 w-16 mx-auto mb-4" />
              </div>
              <div>
                <h3 className="mb-2">No courses yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Get started by adding your first course
                </p>
                <Button onClick={onAddCourse}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Course
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                name={course.name}
                color={course.color}
                percentage={getCoursePercentage(course.id)}
                classTimes={course.classTimes}
                onView={() => onViewCourse(course.id)}
                onEdit={() => onEditCourse(course)}
                onDelete={() => onDeleteCourse(course.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
