"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "./utils";
import { buttonVariants } from "./button";
function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
    return (_jsx(DayPicker, { showOutsideDays: showOutsideDays, className: cn("p-3", className), classNames: {
            months: "flex flex-col sm:flex-row gap-2",
            month: "flex flex-col gap-4",
            caption: "flex justify-center pt-1 relative items-center w-full",
            caption_label: "text-sm font-medium",
            nav: "flex items-center gap-1",
            nav_button: cn(buttonVariants({ variant: "outline" }), "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-x-1",
            head_row: "flex",
            head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: cn("relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent", props.mode === "range"
                ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md"
                : "[&:has([aria-selected])]:rounded-md"),
            day: cn(buttonVariants({ variant: "ghost" }), "size-8 p-0 font-normal aria-selected:opacity-100"),
            ...classNames,
        }, components: {
            Chevron: ({ orientation, ...props }) => orientation === "left" ? _jsx(ChevronLeft, { ...props }) : _jsx(ChevronRight, { ...props })
        }, ...props }));
}
export { Calendar };
