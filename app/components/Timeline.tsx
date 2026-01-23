import React from 'react';
import type { TrackingEvent } from '../../types/tracking';

export default function Timeline({ events }: { events?: TrackingEvent[] }) {
  if (!events || events.length === 0) {
    return <p className="text-gray-500 text-sm">אין אירועי מעקב זמינים</p>;
  }

  return (
    <div className="relative">
      <ol className="space-y-4">
        {events.map((ev, idx) => (
          <li key={idx} className="relative flex gap-4 pb-4">
            {/* Timeline line */}
            {idx < events.length - 1 && (
              <div className="absolute right-[15px] top-6 h-full w-0.5 bg-gray-300" />
            )}
            
            {/* Timeline dot */}
            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-purple-500 bg-white">
              <div className="h-3 w-3 rounded-full bg-purple-500" />
            </div>
            
            {/* Event content */}
            <div className="flex-1 pt-0.5">
              <div className="text-sm font-medium text-gray-900">{ev.status}</div>
              <div className="text-xs text-gray-500 mt-0.5">{ev.date}</div>
              {ev.location && (
                <div className="text-xs text-gray-600 mt-1">{ev.location}</div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
