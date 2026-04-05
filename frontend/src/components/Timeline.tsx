import { Check, Clock } from "lucide-react";

export type OrderStage = "Requested" | "Assigned" | "OnTheWay" | "InProgress" | "Completed";

interface TimelineProps {
  currentStage: OrderStage;
}

const STAGES = [
  { key: "Requested", label: "Booking Requested", description: "Waiting for professional assignment" },
  { key: "Assigned", label: "Professional Assigned", description: "Mohammad Ali has been assigned" },
  { key: "OnTheWay", label: "On The Way", description: "Professional is heading to your location" },
  { key: "InProgress", label: "Service In Progress", description: "Work is currently being done" },
  { key: "Completed", label: "Service Completed", description: "Please leave a rating!" },
];

export function Timeline({ currentStage }: TimelineProps) {
  const currentIndex = STAGES.findIndex(s => s.key === currentStage);

  return (
    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/20 before:via-slate-200 before:to-transparent pt-4">
      {STAGES.map((stage, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={stage.key} className="relative flex items-start gap-4 group">
            <div className="relative mt-1">
               {/* Pulsing ring for current item */}
               {isCurrent && <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping scale-150"></div>}
               <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-white border-4 z-10 shadow-sm transition-all duration-300 ${isCompleted ? 'bg-green-500 text-white' : isCurrent ? 'bg-primary text-white scale-110' : 'bg-gray-100 text-gray-300'}`}>
                 {isCompleted ? <Check className="h-5 w-5" /> : isCurrent ? <Clock className="h-4 w-4 animate-spin-slow" /> : <div className="w-2 h-2 bg-gray-300 rounded-full" />}
               </div>
            </div>
            
            <div className="flex-1 pb-4">
               <div className={`font-bold transition-all ${isCurrent ? 'text-primary text-lg' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                 {stage.label}
               </div>
               <div className={`text-sm mt-0.5 transition-all ${isCurrent ? 'text-gray-600' : isCompleted ? 'text-gray-500' : 'text-gray-400'}`}>
                 {stage.description}
               </div>
               {isCurrent && stage.key === "OnTheWay" && (
                  <div className="mt-3 inline-block bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 text-xs font-black uppercase tracking-widest flex items-center gap-2 rounded">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> Tracking Active
                  </div>
               )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
