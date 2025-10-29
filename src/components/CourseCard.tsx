import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { MoreVertical, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface CourseCardProps {
  id: string;
  name: string;
  color: string;
  percentage: number;
  classTimes: Array<{ day: string; sessions: number }>;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const DAY_SHORT: Record<string, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

export function CourseCard({
  name,
  color,
  percentage,
  classTimes,
  onView,
  onEdit,
  onDelete,
}: CourseCardProps) {
  // Sort class times by day order
  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const sortedClassTimes = [...classTimes].sort(
    (a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
  );

  const totalSessions = classTimes.reduce((sum, ct) => sum + ct.sessions, 0);

  return (
    <Card
      className="p-5 hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={onView}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <h3 className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {name}
          </h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e:React.MouseEvent) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e:React.MouseEvent) => {
              e.stopPropagation();
              onEdit();
            }}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e:React.MouseEvent) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="h-3 w-3" />
          <span>{totalSessions} session{totalSessions !== 1 ? 's' : ''} per week</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {sortedClassTimes.map((ct, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs"
            >
              {DAY_SHORT[ct.day]} ({ct.sessions})
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Attendance</span>
          <span className={percentage >= 75 ? "text-green-600" : "text-red-600"}>
            {percentage.toFixed(1)}%
          </span>
        </div>
        <Progress value={percentage} className="h-2" />
      </div>
    </Card>
  );
}
