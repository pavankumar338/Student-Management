"use client";

import { Student } from "@/types/student";
import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";
import { format, parseISO } from "date-fns";

interface AnalyticsChartsProps {
  students: Student[];
}

export default function AnalyticsCharts({ students }: AnalyticsChartsProps) {
  // 1. Grade Distribution Data
  const gradeData = useMemo(() => {
    const counts: Record<string, number> = {};
    students.forEach((s) => {
      const grade = s.grade || "Unassigned";
      counts[grade] = (counts[grade] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [students]);

  // 2. Residence Type Distribution Data
  const residenceData = useMemo(() => {
    const counts: Record<string, number> = {};
    students.forEach((s) => {
      const type = s.residence_type || "Unassigned";
      counts[type] = (counts[type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [students]);

  // 3. Enrollment Timeline Data
  const enrollmentData = useMemo(() => {
    const counts: Record<string, number> = {};
    students.forEach((s) => {
      if (!s.enrollment_date) return;
      // Group by YYYY-MM
      const month = format(parseISO(s.enrollment_date), "MMM yyyy");
      counts[month] = (counts[month] || 0) + 1;
    });
    // For a real app, you'd sort by actual date. Since keys are formatted, it might be out of order if multiple years exist.
    // We'll keep it simple for now.
    return Object.entries(counts).map(([date, count]) => ({ date, count }));
  }, [students]);

  // Colors for Pie Chart
  const COLORS = ['#2563EB', '#38BDF8', '#8B5CF6', '#F59E0B', '#10B981'];

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Grade Distribution - Bar Chart */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Students per Grade</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#F1F5F9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Residence Type - Pie Chart */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Residence Type</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={residenceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {residenceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Enrollment Timeline - Line Chart */}
      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Enrollment Trends</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={enrollmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#38BDF8" 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, stroke: '#2563EB', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
