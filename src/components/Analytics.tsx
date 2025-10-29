import { Card } from "./ui/card";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { subDays, startOfWeek, endOfWeek } from "date-fns";

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

interface AnalyticsProps {
  course: Course;
  records: AttendanceRecord[];
}

export function Analytics({ course, records }: AnalyticsProps) {
  const getCourseStats = (courseId: string) => {
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

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getTrendText = (trend: number) => {
    if (trend > 0) return `+${trend.toFixed(1)}% from last week`;
    if (trend < 0) return `${trend.toFixed(1)}% from last week`;
    return "No change from last week";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">


      <div>
        <h2 className="mb-4 text-xl">Course-wise Performance</h2>
    

            
              <Card key={course.id} className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: course.color }}
                  />
                  <h3>{course.name}</h3>
                </div>

                <div className="flex flex-col items-center justify-center mb-6">
                  <div className="relative w-32 h-32">
                    <svg className="transform -rotate-90 w-32 h-32">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - getCourseStats(course.id).percentage / 100)}`}
                        className={getCourseStats(course.id).percentage >= 75 ? "text-green-600" : "text-red-600"}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-2xl">{getCourseStats(course.id).percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    {getTrendIcon(getCourseStats(course.id).trend)}
                    <span>{getTrendText(getCourseStats(course.id).trend)}</span>
                  </div>

                  <div className="pt-3 border-t grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 mb-1">
                        Attended
                      </p>
                      <p className="text-xl text-green-600">{getCourseStats(course.id).presentCount}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 mb-1">
                        Total Sessions
                      </p>
                      <p className="text-xl">{getCourseStats(course.id).totalCount}</p>
                    </div>
                  </div>
                </div>
              </Card>
            
          

        </div>
      </div>
    
  );

}