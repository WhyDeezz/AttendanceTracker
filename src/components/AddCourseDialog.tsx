import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";

interface ClassTime {
  day: string;
  sessions: number;
}

interface Course {
  id: string;
  name: string;
  classTimes: ClassTime[];
  color: string;
}

interface AddCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (course: Omit<Course, "id"> | Course) => void;
  editCourse?: Course | null;
}

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

interface DaySchedule {
  enabled: boolean;
  sessions: number;
}

export function AddCourseDialog({
  open,
  onOpenChange,
  onSave,
  editCourse,
}: AddCourseDialogProps) {
  const [courseName, setCourseName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>({
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
      const newSchedule: Record<string, DaySchedule> = {
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
    } else {
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

  const handleToggleDay = (day: string, checked: boolean) => {
    setSchedule({
      ...schedule,
      [day]: { ...schedule[day], enabled: checked },
    });
  };

  const handleSessionsChange = (day: string, sessions: number) => {
    const validSessions = Math.max(1, Math.min(5, sessions)); // Between 1-5 sessions
    setSchedule({
      ...schedule,
      [day]: { ...schedule[day], sessions: validSessions },
    });
  };

  const handleSubmit = () => {
    if (!courseName.trim()) return;

    // Convert schedule object to classTimes array
    const classTimes: ClassTime[] = WEEKDAYS.filter(
      (day) => schedule[day].enabled
    ).map((day) => ({
      day,
      sessions: schedule[day].sessions,
    }));

    if (classTimes.length === 0) return;

    const courseData = {
      ...(editCourse ? { id: editCourse.id } : {}),
      name: courseName,
      classTimes,
      color: selectedColor,
    };

    onSave(courseData as Course);
    onOpenChange(false);
  };

  const enabledDays = WEEKDAYS.filter((day) => schedule[day].enabled).length;
  const totalSessions = WEEKDAYS.reduce((sum, day) => {
    return sum + (schedule[day].enabled ? schedule[day].sessions : 0);
  }, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editCourse ? "Edit Course" : "Add New Course"}
          </DialogTitle>
          <DialogDescription>
            {editCourse 
              ? "Update your course details, schedule, and color." 
              : "Add a new course with weekly schedule and sessions per day."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Course Name</Label>
            <Input
              placeholder="e.g., Physics"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Course Color</Label>
            <div className="flex gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full transition-transform ${
                    selectedColor === color
                      ? "scale-125 ring-2 ring-offset-2 ring-gray-400"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Weekly Schedule (Monday - Friday)</Label>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Select days and specify number of sessions per day
            </p>

            <div className="space-y-3 border rounded-lg p-4">
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <Checkbox
                    id={`day-${day}`}
                    checked={schedule[day].enabled}
                    onCheckedChange={(checked) =>
                      handleToggleDay(day, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`day-${day}`}
                    className="flex-1 cursor-pointer"
                  >
                    {day}
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={schedule[day].sessions}
                      onChange={(e) =>
                        handleSessionsChange(day, parseInt(e.target.value) || 1)
                      }
                      disabled={!schedule[day].enabled}
                      className="w-20"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      session{schedule[day].sessions !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              {enabledDays > 0
                ? `${totalSessions} total session${totalSessions !== 1 ? "s" : ""} per week across ${enabledDays} day${enabledDays !== 1 ? "s" : ""}`
                : "Please select at least one day"}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!courseName.trim() || enabledDays === 0}>
            {editCourse ? "Save Changes" : "Add Course"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
