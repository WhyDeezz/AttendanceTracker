import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ArrowLeft, CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { format } from "date-fns";

interface AttendanceRecord {
  id: string;
  courseId: string;
  date: string;
  status: "present" | "absent" | "nodata";
}

interface Course {
  id: string;
  name: string;
  color: string;
  classTimes: Array<{ day: string; sessions: number }>;
}

interface CourseDetailProps {
  course: Course;
  records: AttendanceRecord[];
  onBack: () => void;
  onToggleAttendance: (recordId: string) => void;
}

export function CourseDetail({
  course,
  records,
  onBack,
  onToggleAttendance,
}: CourseDetailProps) {
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
  }, {} as Record<string, AttendanceRecord[]>);

  // Sort dates in descending order
  const sortedDates = Object.keys(recordsByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "absent":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "nodata":
        return <HelpCircle className="h-4 w-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
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

  const getStatusLabel = (status: string) => {
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: course.color }}
          />
          <h1>{course.name}</h1>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-400">
                Attendance
              </span>
              <span className={percentage >= 75 ? "text-green-600" : "text-red-600"}>
                {percentage.toFixed(1)}%
              </span>
            </div>
            <Progress value={percentage} className="h-3" />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Sessions
              </p>
              <p className="text-2xl">{totalCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Attended
              </p>
              <p className="text-2xl text-green-600">{presentCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Missed
              </p>
              <p className="text-2xl text-red-600">
                {totalCount - presentCount}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4">Attendance History</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Click on any session to toggle between Present → Absent → No Data
        </p>
        {sortedDates.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No attendance records yet
          </p>
        ) : (
          <div className="space-y-3">
            {sortedDates.map((date) => (
              <div key={date} className="space-y-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {format(new Date(date), "EEEE, MMMM d, yyyy")}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {recordsByDate[date].map((record, index) => (
                    <button
                      key={record.id}
                      onClick={() => onToggleAttendance(record.id)}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        <span className="text-sm">Session {index + 1}</span>
                      </div>
                      <Badge className={getStatusColor(record.status)}>
                        {getStatusLabel(record.status)}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
