interface CourseCardProps {
    id: string;
    name: string;
    color: string;
    percentage: number;
    classTimes: Array<{
        day: string;
        sessions: number;
    }>;
    onView: () => void;
    onEdit: () => void;
    onDelete: () => void;
}
export declare function CourseCard({ name, color, percentage, classTimes, onView, onEdit, onDelete, }: CourseCardProps): import("react/jsx-runtime").JSX.Element;
export {};
