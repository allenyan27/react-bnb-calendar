import React from "react";
import {
    DayPicker,
    getDefaultClassNames,
    type DayButton,
    type Locale,
} from "react-day-picker";
import { ChevronLeft, ChevronRight, ChevronDown } from "./icons";
import styles from "./calendar.module.scss";

/**
 * Props for the `Calendar` component, extending all native `react-day-picker` options.
 */
export type CalendarProps = React.ComponentProps<typeof DayPicker>;

/**
 * Base calendar primitive built on top of `react-day-picker` v9.
 * Provides custom styling via SCSS modules and default UI icons.
 *
 * @param props - All valid `DayPicker` props along with custom component overrides.
 */
export function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    captionLayout = "label",
    locale,
    formatters,
    components,
    ...props
}: CalendarProps) {
    const defaultClassNames = getDefaultClassNames();

    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={`${styles.calendarContainer} ${className || ""}`}
            captionLayout={captionLayout}
            locale={locale}
            formatters={{
                formatMonthDropdown: (date) =>
                    date.toLocaleString(locale?.code, { month: "short" }),
                ...formatters,
            }}
            classNames={{
                root: defaultClassNames.root,
                months: defaultClassNames.months,
                month: defaultClassNames.month,
                nav: defaultClassNames.nav,
                month_caption: defaultClassNames.month_caption,
                month_grid: defaultClassNames.month_grid,
                weekdays: defaultClassNames.weekdays,
                weekday: defaultClassNames.weekday,
                week: defaultClassNames.week,
                day: defaultClassNames.day,
                outside: defaultClassNames.outside,
                disabled: defaultClassNames.disabled,
                hidden: defaultClassNames.hidden,
                ...classNames,
            }}
            components={{
                Root: ({ className, rootRef, ...props }) => (
                    <div ref={rootRef} className={className} {...props} />
                ),
                Chevron: ({ orientation, ...props }) => {
                    if (orientation === "left")
                        return <ChevronLeft {...props} />;
                    if (orientation === "right")
                        return <ChevronRight {...props} />;
                    return <ChevronDown {...props} />;
                },
                DayButton: (props) => (
                    <CalendarDayButton locale={locale} {...props} />
                ),
                ...components,
            }}
            {...props}
        />
    );
}

/**
 * Custom day cell button component used inside the calendar grid.
 * Handles keyboard focus states and data attributes for range selections.
 *
 * @param props - `DayButton` props provided by `react-day-picker`, plus optional locale settings.
 */
export function CalendarDayButton({
    className,
    day,
    modifiers,
    locale,
    ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
    const ref = React.useRef<HTMLButtonElement>(null);

    React.useEffect(() => {
        if (modifiers.focused) ref.current?.focus();
    }, [modifiers.focused]);

    return (
        <button
            ref={ref}
            type="button"
            data-day={day.date.toLocaleDateString(locale?.code)}
            data-selected-single={
                modifiers.selected &&
                !modifiers.range_start &&
                !modifiers.range_end &&
                !modifiers.range_middle
            }
            data-range-start={modifiers.range_start}
            data-range-end={modifiers.range_end}
            data-range-middle={modifiers.range_middle}
            className={`${styles.dayButton} ${className || ""}`}
            {...props}
        />
    );
}
