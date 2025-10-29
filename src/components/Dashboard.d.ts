interface Course {
    id: string;
    name: string;
    color: string;
    classTimes: Array<{
        day: string;
        sessions: number;
    }>;
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
export declare function Dashboard({ courses, records, onAddCourse, onViewCalendar, onViewCourse, onEditCourse, onDeleteCourse, }: DashboardProps): import("react/jsx-runtime").JSX.Element;
export {};
