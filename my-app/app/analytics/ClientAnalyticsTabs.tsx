"use client";

import { useState, ReactNode } from "react";
import { Award, CalendarRange } from "lucide-react";

interface ClientAnalyticsTabsProps {
  performanceComponent: ReactNode;
  attendanceComponent: ReactNode;
}

export default function ClientAnalyticsTabs({ performanceComponent, attendanceComponent }: ClientAnalyticsTabsProps) {
  const [activeTab, setActiveTab] = useState<"performance" | "attendance">("performance");

  return (
    <div className="space-y-6">
      {/* Switch Buttons */}
      <div className="flex border-b border-border gap-2 pb-px select-none">
        <button
          onClick={() => setActiveTab("performance")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-semibold text-sm transition-all duration-200 ${
            activeTab === "performance"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Award size={18} />
          Academic Performance
        </button>

        <button
          onClick={() => setActiveTab("attendance")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-semibold text-sm transition-all duration-200 ${
            activeTab === "attendance"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <CalendarRange size={18} />
          Attendance Metrics
        </button>
      </div>

      {/* Tab Render Workspace */}
      <div className="transition-all duration-300">
        {activeTab === "performance" ? performanceComponent : attendanceComponent}
      </div>
    </div>
  );
}
