type ClassEvent = {
  id: string;
  title: string;
  instructor: string;
  day: string;
  time: string;
  meetLink: string;
};

type Props = {
  events: ClassEvent[];
};

// Simple list-based calendar with join links (Google Meet)
export function ClassCalendar({ events }: Props) {
  if (!events.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600 shadow-sm">
        No sessions booked yet. Pick a time to get started.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div
          key={event.id}
          className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {event.day} · {event.time}
            </p>
            <p className="text-lg font-semibold text-slate-800">{event.title}</p>
            <p className="text-sm text-slate-600">With {event.instructor}</p>
          </div>
          <a
            href={event.meetLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-600"
          >
            Join on Google Meet →
          </a>
        </div>
      ))}
    </div>
  );
}

export default ClassCalendar;
