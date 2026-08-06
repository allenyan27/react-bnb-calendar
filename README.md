# react-bnb-calendar

A lightweight, customizable, Airbnb-style date range picker for React built on top of **`react-day-picker` v9**, **TypeScript**, and **SCSS Modules**.

Features include daily price tags under each date, minimum stay tooltips, timezone synchronization, ISO currency formatting, and CSS custom properties for seamless theme customization.

---

## Features

- 📅 **Airbnb-Style Selection**: Smooth range and single date picker experience.
- 💵 **Daily Pricing**: Display per-night rates under each date cell.
- 💬 **Minimum Stay Tooltips**: Show minimum stay requirements on hover.
- 🌐 **Timezone Aware**: Keep date mapping consistent across different client timezones.
- 💱 **Localized Currency**: Standardized ISO 4217 currency formatting using `Intl.NumberFormat`.
- 🎨 **Easy Theme Customization**: Tweak colors using CSS variables.
- 🛠️ **Fully Typed**: Written in TypeScript with complete TSDoc support for IDE IntelliSense.

---

## Installation

Install `react-bnb-calendar` and its peer dependencies via your package manager of choice:

```bash
# pnpm
pnpm add react-bnb-calendar@latest react-day-picker

# npm
npm install react-bnb-calendar@latest react-day-picker

# yarn
yarn add react-bnb-calendar@latest react-day-picker
```

---

## Quick Start

Import the component and its stylesheet in your React application:

```tsx
import React, { useState } from "react";
import { DateRangeCalendar, type DateEntry } from "react-bnb-calendar";
import type { DateRange } from "react-day-picker";

// Import compiled CSS styles
import "react-bnb-calendar/dist/index.css";
// OR
import "react-bnb-calendar/style.css";

const sampleDatesData: DateEntry[] = [
  {
    date: "2026-08-10",
    price: 150,
    disabled: false,
    availableForCheckin: true,
    availableForCheckout: true,
    minStay: 2,
  },
  {
    date: "2026-08-11",
    price: 180,
    disabled: false,
    availableForCheckin: true,
    availableForCheckout: true,
    minStay: 2,
  },
  {
    date: "2026-08-12",
    price: 200,
    disabled: false,
    availableForCheckin: true,
    availableForCheckout: true,
    minStay: 3,
  },
];

export function BookingCalendar() {
  const [range, setRange] = useState<DateRange undefined |>({
    from: new Date("2026-08-10"),
    to: new Date("2026-08-12"),
  });

  return (
    <DateRangeCalendar currency="USD" datesData="{sampleDatesData}" mode="range" months="{2}" onChange="{setRange}" timeZone="America/New_York" value="{range}"/>
  );
}
```

---

## API Reference

### `DateRangeCalendarProps`

| Prop           | Type                                      | Default      | Description                                                                    |
| :------------- | :---------------------------------------- | :----------- | :----------------------------------------------------------------------------- |
| `datesData`    | `DateEntry[]`                             | **Required** | Array of daily entries containing price, availability, and min-stay rules.     |
| `value`        | `DateRange \| undefined`                  | `undefined`  | Currently selected date range (`{ from: Date, to: Date }`).                    |
| `onChange`     | `(range: DateRange \| undefined) => void` | `undefined`  | Callback fired when selection changes.                                         |
| `mode`         | `'range' \| 'single' \| undefined`        | `undefined`  | Selection mode. If `undefined`, calendar behaves as read-only.                 |
| `months`       | `number`                                  | `2`          | Number of visible months to display side-by-side.                              |
| `currency`     | `string`                                  | `"USD"`      | ISO 4217 currency code (e.g., `"USD"`, `"EUR"`, `"IDR"`).                      |
| `timeZone`     | `string`                                  | `undefined`  | IANA time zone string (e.g., `"UTC"`, `"Asia/Jakarta"`, `"America/New_York"`). |
| `disabledDays` | `any[]`                                   | `[]`         | Array of dates/matchers to disable in the calendar.                            |
| `bookedDays`   | `any[]`                                   | `[]`         | Array of dates marked as booked.                                               |
| `className`    | `string`                                  | `undefined`  | Custom CSS class for the outer calendar container.                             |

---

### `DateEntry` Interface

```typescript
export interface DateEntry {
    /** Date string in ISO format (e.g., "2026-08-10") */
    date: string;

    /** Price per night */
    price: number;

    /** Disables date selection when true */
    disabled: boolean;

    /** Whether check-in is allowed on this date */
    availableForCheckin: boolean;

    /** Whether check-out is allowed on this date */
    availableForCheckout: boolean;

    /** Minimum length of stay in nights required when selecting this date */
    minStay: number;
}
```

---

## Styling & Customization

`react-bnb-calendar` uses CSS custom properties for effortless theme customization. You can override these variables globally or within a specific container class:

```css
/* Override theme colors in your app's stylesheet */
:root {
    /* Airbnb Coral / Red Accent */
    --calendar-primary: #ff385c;

    /* Selection range background */
    --calendar-primary-light: #ffe5e9;

    /* Hover state on selection */
    --calendar-primary-hover: #ffb3be;

    /* Primary text color */
    --calendar-text: #222222;

    /* Disabled and outside date text */
    --calendar-muted: #717171;

    /* Border and navigation controls */
    --calendar-border: #dddddd;
}
```

---

## License

MIT
