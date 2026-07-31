import { useState } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { IconCalendar } from "../layouts/icons";
import "./Calendar.css";

type EventType = "high" | "medium" | "low";

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // "YYYY-MM-DD"
  type: EventType;
}

// Placeholder data — swap for a real fetch once the events/tasks-with-dates
// query exists.
const mockEvents: CalendarEvent[] = [
  { id: "1", title: "Design Login UI due", date: "2026-08-01", type: "high" },
  { id: "2", title: "Connect Supabase", date: "2026-07-31", type: "medium" },
  { id: "3", title: "Fix Authentication", date: "2026-08-07", type: "high" },
  { id: "4", title: "Sprint planning", date: "2026-08-03", type: "low" },
  { id: "5", title: "Icon set review", date: "2026-08-02", type: "medium" },
];

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toDateKey(year: number, month: number, day: number) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

export function Calendar() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const eventsByDate = mockEvents.reduce<Record<string, CalendarEvent[]>>((acc, ev) => {
    (acc[ev.date] ??= []).push(ev);
    return acc;
  }, {});

  function goToPrevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function goToNextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function goToToday() {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  }

  const cells: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <DashboardLayout pageTitle="Calendar">
      <div className="calendar-header">
        <p className="eyebrow">
          {monthNames[viewMonth]} {viewYear}
        </p>
        <div className="calendar-controls">
          <button className="calendar-nav-btn" onClick={goToPrevMonth} aria-label="Previous month">
            ‹
          </button>
          <button className="calendar-today-btn" onClick={goToToday}>
            Today
          </button>
          <button className="calendar-nav-btn" onClick={goToNextMonth} aria-label="Next month">
            ›
          </button>
        </div>
      </div>

      <div className="frame calendar-grid-wrap">
        <div className="calendar-weekdays">
          {weekdayLabels.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        <div className="calendar-grid">
          {cells.map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} className="calendar-cell calendar-cell-empty" />;
            }
            const dateKey = toDateKey(viewYear, viewMonth, day);
            const dayEvents = eventsByDate[dateKey] ?? [];
            const isToday = dateKey === todayKey;

            return (
              <div key={dateKey} className={`calendar-cell${isToday ? " is-today" : ""}`}>
                <span className="calendar-cell-day">{day}</span>
                <div className="calendar-cell-events">
                  {dayEvents.map((ev) => (
                    <span key={ev.id} className={`calendar-event calendar-event-${ev.type}`}>
                      {ev.title}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="calendar-legend">
        <IconCalendar className="calendar-legend-icon" />
        <span className="calendar-legend-item">
          <span className="calendar-legend-dot calendar-event-high" /> High priority
        </span>
        <span className="calendar-legend-item">
          <span className="calendar-legend-dot calendar-event-medium" /> Medium priority
        </span>
        <span className="calendar-legend-item">
          <span className="calendar-legend-dot calendar-event-low" /> Low priority
        </span>
      </div>
    </DashboardLayout>
  );
}