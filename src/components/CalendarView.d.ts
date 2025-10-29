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
export declare function CalendarWeeklyView({ courses, records, onToggleAttendance }: CalendarWeeklyViewProps): import("react/jsx-runtime").JSX.Element;
export {};
