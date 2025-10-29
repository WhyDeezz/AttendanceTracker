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
export declare function Analytics({ course, records }: AnalyticsProps): import("react/jsx-runtime").JSX.Element;
export {};
