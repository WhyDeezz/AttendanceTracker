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
    classTimes: Array<{
        day: string;
        sessions: number;
    }>;
}
interface CourseDetailProps {
    course: Course;
    records: AttendanceRecord[];
    onBack: () => void;
    onToggleAttendance: (recordId: string) => void;
}
export declare function CourseDetail({ course, records, onBack, onToggleAttendance, }: CourseDetailProps): import("react/jsx-runtime").JSX.Element;
export {};
