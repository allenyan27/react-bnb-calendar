import React from "react";
import { Calendar, CalendarDayButton } from "./calendar";
import { ChevronLeft, ChevronRight } from "./icons";
import { DateRange } from "react-day-picker";
import styles from "./calendar.module.scss";

/**
 * Daily entry data for a specific date in the calendar.
 */
export interface DateEntry {
    /** The date string in ISO format (e.g., "2026-08-10") */
    date: string;
    /** Price per night for this date */
    price: number;
    /** Whether the date is disabled for selection */
    disabled: boolean;
    /** Whether check-in is allowed on this date */
    availableForCheckin: boolean;
    /** Whether check-out is allowed on this date */
    availableForCheckout: boolean;
    /** Minimum required length of stay in nights when booking this date */
    minStay: number;
}

/**
 * Props for the `DateRangeCalendar` component.
 */
export interface DateRangeCalendarProps {
    /**
     * The currently selected date range object (`{ from: Date, to: Date }`).
     */
    value?: DateRange | undefined;

    /**
     * Callback function triggered when the user selects or changes dates.
     *
     * @param range - The newly formed date range containing the `from` and `to` dates, or `undefined` if the selection is cleared.
     * @param triggerDate - The specific date that the user clicked/interacted with to trigger this event.
     */
    onChange?: (range: DateRange | undefined, triggerDate: Date) => void;

    /**
     * Selection mode of the calendar.
     * - `'range'`: Allows selecting a date range (check-in & check-out).
     * - `'single'`: Allows selecting a single date.
     * - `undefined`: Keeps the calendar in read-only mode.
     * @default undefined
     */
    mode?: "single" | "range" | undefined;

    /**
     * Array of days/dates that should be disabled.
     */
    disabledDays?: any[];

    /**
     * Array of days/dates that are already booked.
     */
    bookedDays?: any[];

    /**
     * Array of daily entries containing pricing, availability, and minimum stay info.
     */
    datesData: DateEntry[];

    /**
     * Number of visible months to display side-by-side.
     * @default 2
     */
    months?: number;

    /**
     * Custom CSS class name to override outer wrapper styles.
     */
    className?: string;

    /**
     * ISO 4217 currency code (e.g., `"USD"`, `"EUR"`, `"GBP"`) for price formatting.
     * @default "USD"
     */
    currency?: string;

    /**
     * IANA time zone string (e.g., `"UTC"`, `"America/New_York"`, `"Asia/Tokyo"`) to ensure date keys remain consistent across client locales.
     */
    timeZone?: string;
}

/**
 * An Airbnb-style date range calendar with daily pricing tags, minimum stay tooltips, and customizable theme variables.
 *
 * @example
 * ```tsx
 * <DateRangeCalendar currency="USD" datesData="{sampleDatesData}" mode="range" months="{2}" onChange="{setRange}" timeZone="America/New_York" value="{range}"/>
 * ```
 */
export const DateRangeCalendar = ({
    value,
    onChange,
    mode = undefined,
    disabledDays = [],
    bookedDays = [],
    datesData,
    months = 2,
    className,
    currency = "USD",
    timeZone,
}: DateRangeCalendarProps) => {
    const todayDate = React.useMemo(() => new Date(), []);
    const isReadOnly = mode === undefined;

    const formatter = React.useMemo(() => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
            maximumFractionDigits: 0,
        });
    }, [currency]);

    const getISODateKey = React.useCallback(
        (date: Date | string) => {
            const dateObj = typeof date === "string" ? new Date(date) : date;

            if (!timeZone) {
                return dateObj.toISOString().split("T")[0];
            }

            const formatter = new Intl.DateTimeFormat("en-CA", {
                timeZone,
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            });
            return formatter.format(dateObj);
        },
        [timeZone],
    );

    const dateMap = React.useMemo(() => {
        const map = new Map<string, DateEntry>();
        for (const p of datesData) {
            const key = getISODateKey(p.date);
            map.set(key, p);
        }
        return map;
    }, [datesData, getISODateKey]);

    return (
        <Calendar
            mode={mode as any}
            selected={value}
            onSelect={(range: DateRange, triggerDate: Date) =>
                onChange?.(range as any, triggerDate)
            }
            disabled={disabledDays}
            startMonth={todayDate}
            defaultMonth={value?.from}
            numberOfMonths={months}
            modifiers={{
                booked: bookedDays,
                beforeToday: { before: todayDate },
            }}
            className={className}
            showOutsideDays={true}
            excludeDisabled
            components={{
                DayButton: ({ children, modifiers, day, ...props }) => {
                    const isoDate = getISODateKey(day.date);
                    const dateEntry = dateMap.get(isoDate);
                    const price = dateEntry ? Number(dateEntry.price) : 0;
                    const isFree = price === 0;

                    const shouldBeDisabled = isReadOnly || props.disabled;
                    const isStartOrEnd =
                        modifiers.range_start || modifiers.range_end;

                    return (
                        <CalendarDayButton
                            day={day}
                            modifiers={modifiers}
                            {...props}
                            disabled={shouldBeDisabled}
                        >
                            {!modifiers.outside && dateEntry ? (
                                <div className={styles.tooltipWrapper}>
                                    <div className={styles.dayContent}>
                                        <p
                                            className={`${styles.dateText} ${
                                                isStartOrEnd
                                                    ? styles[
                                                          "dateText--selected"
                                                      ]
                                                    : ""
                                            }`}
                                        >
                                            {children}
                                        </p>
                                        {isFree ? (
                                            <span
                                                className={
                                                    styles["priceText--none"]
                                                }
                                            >
                                                No Price
                                            </span>
                                        ) : (
                                            <span
                                                className={`${styles.priceText} ${
                                                    isStartOrEnd
                                                        ? styles[
                                                              "priceText--selected"
                                                          ]
                                                        : ""
                                                }`}
                                            >
                                                {formatter.format(price)}
                                            </span>
                                        )}
                                    </div>
                                    <div
                                        className={styles.tooltip}
                                        role="tooltip"
                                    >
                                        {dateEntry.minStay}-night minimum
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.dayContent}>
                                    <p className={styles.dateText}>
                                        {children}
                                    </p>
                                    <span className={styles["priceText--none"]}>
                                        --
                                    </span>
                                </div>
                            )}
                        </CalendarDayButton>
                    );
                },
                NextMonthButton: (props) => (
                    <button
                        type="button"
                        aria-label="Next Month"
                        {...props}
                        className={styles.navButton}
                    >
                        <ChevronRight />
                    </button>
                ),
                PreviousMonthButton: (props) => (
                    <button
                        type="button"
                        aria-label="Previous Month"
                        {...props}
                        className={styles.navButton}
                    >
                        <ChevronLeft />
                    </button>
                ),
            }}
        />
    );
};
