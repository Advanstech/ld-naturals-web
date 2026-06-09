import React from 'react';
import { Package, Truck, CheckCircle2, Plane, MapPin, Clock } from 'lucide-react';

interface TrackingEvent {
  status: string;
  location: string;
  timestamp: string;
  completed: boolean;
}

interface TrackingTimelineProps {
  events: TrackingEvent[];
  carrier: string;
  trackingNumber: string;
}

export default function TrackingTimeline({ events, carrier, trackingNumber }: TrackingTimelineProps) {
  // Sort events chronologically to find current status
  const sortedEvents = [...events].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const currentEvent = sortedEvents.reverse().find(e => e.completed) || events[0];

  const getIcon = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('delivered')) return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    if (s.includes('shipped') || s.includes('out for delivery') || s.includes('courier')) return <Truck className="w-5 h-5 text-terracotta" />;
    if (s.includes('clearance') || s.includes('departed')) return <Plane className="w-5 h-5 text-blue-500" />;
    if (s.includes('placed') || s.includes('confirmed')) return <Package className="w-5 h-5 text-gold" />;
    return <MapPin className="w-5 h-5 text-cocoa/50" />;
  };

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-[2rem] border border-cocoa/10 p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-cocoa/10 mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cocoa/50 mb-1">Tracking Number</p>
          <div className="flex items-center gap-3">
            <h3 className="font-cormorant text-3xl font-bold">{trackingNumber || 'PENDING'}</h3>
            {carrier && (
              <span className={`text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                carrier.toLowerCase() === 'dhl' 
                  ? 'bg-yellow-400 text-red-700' 
                  : carrier.toLowerCase() === 'swoove'
                    ? 'bg-orange-500 text-white'
                    : 'bg-cocoa/10 text-cocoa'
              }`}>
                {carrier}
              </span>
            )}
          </div>
        </div>
        <div className="text-left md:text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cocoa/50 mb-1">Current Status</p>
          <p className="text-lg font-semibold text-cocoa">{currentEvent?.status || 'Unknown'}</p>
        </div>
      </div>

      <div className="relative pl-4 md:pl-8">
        {/* Vertical Line */}
        <div className="absolute left-[1.6rem] md:left-[2.6rem] top-4 bottom-4 w-px bg-cocoa/20"></div>

        <div className="space-y-8">
          {events.map((event, index) => {
            const isLatest = index === 0; // Assuming events are passed in reverse chronological order (newest first)
            
            return (
              <div key={index} className={`relative flex gap-6 md:gap-8 ${!event.completed ? 'opacity-50 grayscale' : ''}`}>
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  isLatest && event.completed ? 'bg-white shadow-md border-2 border-terracotta' : 'bg-white/80 border border-cocoa/10'
                }`}>
                  {getIcon(event.status)}
                </div>
                
                <div className={`flex-1 ${isLatest && event.completed ? 'pt-1' : 'pt-2'}`}>
                  <h4 className={`text-base md:text-lg font-semibold mb-1 ${isLatest && event.completed ? 'text-cocoa' : 'text-cocoa/80'}`}>
                    {event.status}
                  </h4>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-cocoa/60">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {event.location}
                    </span>
                    <span className="hidden sm:inline text-cocoa/30">•</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(event.timestamp).toLocaleString('en-US', {
                        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
