import { useState } from "react";
import { Card } from "./ui/card";
import { CheckCircle2, XCircle, HelpCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfWeek, addDays, subWeeks, addWeeks } from "date-fns";

interface Course {
  id: string;
  name: string;
  color: string;
}

interface AttendanceRecord {
  id: string;
  courseId: string;
  date: string;
  status: "present" | "absent" | "nodata";
}

interface CalendarWeeklyViewProps {
  courses: Course[];
  records: AttendanceRecord[];
  onToggleAttendance: (recordId: string) => void;
}

export function CalendarWeeklyView({ courses, records, onToggleAttendance }: CalendarWeeklyViewProps) {
  const [selectedWeekStart, setSelectedWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const getWeekDates = () => Array.from({ length: 7 }).map((_, i) => addDays(selectedWeekStart, i));

  const getRecord = (courseId: string, date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return records.find((r) => r.courseId === courseId && r.date === dateStr);
  };

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

  const goToPreviousWeek = () => setSelectedWeekStart(subWeeks(selectedWeekStart, 1));
  const goToNextWeek = () => setSelectedWeekStart(addWeeks(selectedWeekStart, 1));

  return (
    <div className="space-y-6 text-sm sm:text-base">
      {/* Week Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-lg sm:text-xl font-semibold">Weekly Timetable</h1>
        <div className="flex items-center justify-between sm:justify-end gap-2">
          <button
            onClick={goToPreviousWeek}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title="Previous Week"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-gray-600 dark:text-gray-400 font-medium text-sm sm:text-base">
            {format(selectedWeekStart, "MMM d")} - {format(addDays(selectedWeekStart, 6), "MMM d, yyyy")}
          </span>
          <button
            onClick={goToNextWeek}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title="Next Week"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-x-auto rounded-2xl shadow-sm">
        <table className="w-full border-collapse text-xs sm:text-sm">
          <thead>
            <tr>
              <th className="w-1/6 border p-2 sticky left-0 bg-white dark:bg-gray-900">Course</th>
              {getWeekDates().map((date, i) => {
                const isWeekend = i >= 5; // Saturday (5) or Sunday (6)
                return (
                  <th
                    key={date.toString()}
                    className={`border p-2 text-center ${
                      isWeekend ? "hidden sm:table-cell" : ""
                    }`}
                  >
                    {format(date, "EEE dd/MM")}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="text-sm">
                <td className="border p-2 flex items-center gap-2 sticky left-0 bg-white dark:bg-gray-900">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: course.color }}
                  />
                  <span className="truncate">{course.name}</span>
                </td>
                {getWeekDates().map((date, i) => {
                  const isWeekend = i >= 5;
                  const record = getRecord(course.id, date);
                  return (
                    <td
                      key={date.toString()}
                      className={`border p-1 text-center ${
                        isWeekend ? "hidden sm:table-cell" : ""
                      }`}
                    >
                      {record ? (
                        <button
                          onClick={() => onToggleAttendance(record.id)}
                          className={`flex items-center justify-center w-full px-2 py-1 rounded ${getStatusColor(
                            record.status
                          )} hover:opacity-80 transition`}
                        >
                          {getStatusIcon(record.status)}
                        </button>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
