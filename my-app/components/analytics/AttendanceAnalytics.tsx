"use client";

import { useMemo, useState } from "react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { format, parseISO } from "date-fns";
import { Calendar, Users, AlertCircle, TrendingUp } from "lucide-react";

interface AttendanceAnalyticsProps {
  attendanceData: any[];
  studentsData: any[];
}

export default function AttendanceAnalytics({ attendanceData, studentsData }: AttendanceAnalyticsProps) {
  const [selectedGrade, setSelectedGrade] = useState("All");

  // Unique grades list
  const grades = useMemo(() => {
    const list = studentsData.map(s => s.grade).filter(Boolean);
    return ["All", ...Array.from(new Set(list))];
  }, [studentsData]);

  // General computed statistics
  const stats = useMemo(() => {
    if (attendanceData.length === 0) {
      return { avgRate: 0, totalRecords: 0, latePct: 0, absentCount: 0 };
    }

    const presentOrLate = attendanceData.filter(r => r.status === "Present" || r.status === "Late").length;
    const late = attendanceData.filter(r => r.status === "Late").length;
    const absent = attendanceData.filter(r => r.status === "Absent").length;
    const avgRate = Math.round((presentOrLate / attendanceData.length) * 100);
    const latePct = Math.round((late / attendanceData.length) * 100);

    return {
      avgRate,
      totalRecords: attendanceData.length,
      latePct,
      absentCount: absent
    };
  }, [attendanceData]);

  // 1. Line Chart Data: Daily Attendance Trends over time
  const trendChartData = useMemo(() => {
    const dateGroups: Record<string, { present: number; total: number }> = {};

    attendanceData.forEach(r => {
      // Filter by selected grade if not "All"
      if (selectedGrade !== "All") {
        const student = studentsData.find(s => s.id === r.student_id);
        if (student?.grade !== selectedGrade) return;
      }

      const dStr = r.date;
      if (!dateGroups[dStr]) {
        dateGroups[dStr] = { present: 0, total: 0 };
      }
      dateGroups[dStr].total++;
      if (r.status === "Present" || r.status === "Late") {
        dateGroups[dStr].present++;
      }
    });

    return Object.entries(dateGroups)
      .map(([date, counts]) => ({
        date: format(parseISO(date), "MMM dd"),
        rate: Math.round((counts.present / counts.total) * 100),
        rawDate: date
      }))
      .sort((a, b) => a.rawDate.localeCompare(b.rawDate))
      .slice(-10); // Last 10 days
  }, [attendanceData, studentsData, selectedGrade]);

  // 2. Bar Chart Data: Attendance Rate by Grade
  const gradeChartData = useMemo(() => {
    const gradeGroups: Record<string, { present: number; total: number }> = {};

    attendanceData.forEach(r => {
      const student = studentsData.find(s => s.id === r.student_id);
      const grade = student?.grade || "Unassigned";

      if (!gradeGroups[grade]) {
        gradeGroups[grade] = { present: 0, total: 0 };
      }
      gradeGroups[grade].total++;
      if (r.status === "Present" || r.status === "Late") {
        gradeGroups[grade].present++;
      }
    });

    return Object.entries(gradeGroups).map(([grade, counts]) => ({
      name: grade,
      rate: Math.round((counts.present / counts.total) * 100)
    }));
  }, [attendanceData, studentsData]);

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Calendar className="text-primary" /> Attendance Metrics & Analytics
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Track presence rates, late patterns, and performance per class.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Filter Class:</span>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-3 py-1.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-xs font-semibold"
            >
              {grades.map(grade => (
                <option key={grade} value={grade}>{grade === "All" ? "All Grades" : grade}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Avg Attendance Rate</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.avgRate}%</p>
          </div>
          <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Total Check-Ins</p>
            <p className="text-2xl font-bold text-primary mt-1">{stats.totalRecords}</p>
          </div>
          <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Late Rate</p>
            <p className="text-2xl font-bold text-amber-500 mt-1">{stats.latePct}%</p>
          </div>
          <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Total Absences</p>
            <p className="text-2xl font-bold text-red-500 mt-1">{stats.absentCount}</p>
          </div>
        </div>
      </div>

      {attendanceData.length === 0 ? (
        <div className="bg-card border border-border p-12 rounded-2xl shadow-sm text-center">
          <AlertCircle className="mx-auto text-muted-foreground/50 mb-3" size={36} />
          <p className="text-muted-foreground text-lg">No attendance data currently recorded.</p>
          <p className="text-sm text-muted-foreground/75 mt-1">Submit check-ins on the Attendance page to generate dynamic analytics.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Attendance Trend Line Chart */}
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Attendance Trend over Time</h3>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="rate" stroke="#2563EB" strokeWidth={3} activeDot={{ r: 6 }} dot={{ strokeWidth: 2, r: 4 }} name="Attendance %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Grade-wise Roster Rates */}
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Class-wise Attendance Rates</h3>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                  <Tooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="rate" fill="#10B981" radius={[4, 4, 0, 0]} barSize={40} name="Presence Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
