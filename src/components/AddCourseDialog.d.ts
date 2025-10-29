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
export declare function AddCourseDialog({ open, onOpenChange, onSave, editCourse, }: AddCourseDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
