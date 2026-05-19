"use client";

import { useState, useMemo } from "react";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { TrendingUp, Percent, CheckCircle, XCircle } from "lucide-react";

interface PerformanceAnalyticsProps {
  examResults: any[];
}

export default function PerformanceAnalytics({ examResults }: PerformanceAnalyticsProps) {
  // Filter States
  const [selectedExam, setSelectedExam] = useState("All");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedGrade, setSelectedGrade] = useState("All");

  // Dynamic filter option listings
  const examOptions = useMemo(() => {
    const exams = examResults.map(r => r.exam_name).filter(Boolean);
    return ["All", ...Array.from(new Set(exams))];
  }, [examResults]);

  const subjectOptions = useMemo(() => {
    const subjects = examResults.map(r => r.subject).filter(Boolean);
    return ["All", ...Array.from(new Set(subjects))];
  }, [examResults]);

  const gradeOptions = useMemo(() => {
    const grades = examResults.map(r => r.students?.grade).filter(Boolean);
    return ["All", ...Array.from(new Set(grades))];
  }, [examResults]);

  // Filtered Exam Data
  const filteredData = useMemo(() => {
    return examResults.filter(result => {
      const matchExam = selectedExam === "All" || result.exam_name === selectedExam;
      const matchSubject = selectedSubject === "All" || result.subject === selectedSubject;
      const matchGrade = selectedGrade === "All" || result.students?.grade === selectedGrade;
      return matchExam && matchSubject && matchGrade;
    });
  }, [examResults, selectedExam, selectedSubject, selectedGrade]);

  // Calculations (Pass mark is 30% of total)
  const stats = useMemo(() => {
    if (filteredData.length === 0) {
      return { total: 0, passCount: 0, failCount: 0, passPercentage: 0, averagePercentage: 0, highest: 0 };
    }

    let passCount = 0;
    let totalPct = 0;
    let highest = 0;

    filteredData.forEach(result => {
      const pct = (result.marks_obtained / result.total_marks) * 100;
      if (pct >= 30) passCount++;
      totalPct += pct;
      if (pct > highest) highest = pct;
    });

    const total = filteredData.length;
    const failCount = total - passCount;
    const passPercentage = Math.round((passCount / total) * 100);
    const averagePercentage = Math.round(totalPct / total);

    return {
      total,
      passCount,
      failCount,
      passPercentage,
      averagePercentage,
      highest: Math.round(highest)
    };
  }, [filteredData]);

  // Chart Data: Pass vs Fail
  const passFailChartData = useMemo(() => {
    return [
      { name: "Pass (≥30%)", value: stats.passCount, color: "#10B981" },
      { name: "Fail (<30%)", value: stats.failCount, color: "#EF4444" }
    ];
  }, [stats]);

  // Chart Data: Grade/Mark Distribution Brackets
  const distributionChartData = useMemo(() => {
    const brackets = {
      "Fail (<30%)": 0,
      "Average (30-60%)": 0,
      "Good (60-85%)": 0,
      "Excellent (85-100%)": 0
    };

    filteredData.forEach(result => {
      const pct = (result.marks_obtained / result.total_marks) * 100;
      if (pct < 30) brackets["Fail (<30%)"]++;
      else if (pct < 60) brackets["Average (30-60%)"]++;
      else if (pct < 85) brackets["Good (60-85%)"]++;
      else brackets["Excellent (85-100%)"]++;
    });

    return Object.entries(brackets).map(([name, count]) => ({ name, count }));
  }, [filteredData]);

  return (
    <div className="space-y-6">
      {/* Header and Interactive Filters */}
      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <TrendingUp className="text-primary" /> Dynamic Performance Analytics
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Interactive metrics based on exam, subject, and grade.</p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Exam</label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            >
              {examOptions.map(exam => (
                <option key={exam} value={exam}>{exam === "All" ? "All Exams" : exam}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            >
              {subjectOptions.map(subject => (
                <option key={subject} value={subject}>{subject === "All" ? "All Subjects" : subject}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Grade</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            >
              {gradeOptions.map(grade => (
                <option key={grade} value={grade}>{grade === "All" ? "All Grades" : grade}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="bg-card border border-border p-12 rounded-2xl shadow-sm text-center">
          <p className="text-muted-foreground text-lg">No performance records match the selected combination.</p>
          <p className="text-sm text-muted-foreground/75 mt-1">Try selecting different filters to see graph calculations.</p>
        </div>
      ) : (
        <>
          {/* Key metrics grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card p-5 rounded-2xl border border-border shadow-sm">
              <p className="text-xs font-medium text-muted-foreground uppercase">Records Count</p>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </div>

            <div className="bg-card p-5 rounded-2xl border border-border shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Pass Rate</p>
                <p className="text-2xl font-bold mt-1 text-green-600">{stats.passPercentage}%</p>
              </div>
              <CheckCircle className="text-green-500/20" size={32} />
            </div>

            <div className="bg-card p-5 rounded-2xl border border-border shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Avg Score</p>
                <p className="text-2xl font-bold mt-1 text-primary">{stats.averagePercentage}%</p>
              </div>
              <Percent className="text-primary/20" size={32} />
            </div>

            <div className="bg-card p-5 rounded-2xl border border-border shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Highest Score</p>
                <p className="text-2xl font-bold mt-1 text-purple-600">{stats.highest}%</p>
              </div>
              <TrendingUp className="text-purple-500/20" size={32} />
            </div>
          </div>

          {/* Graphics Section */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Pass vs Fail Ratio */}
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Pass / Fail Ratio</h3>
              <div className="h-[280px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={passFailChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {passFailChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Score Distribution Brackets */}
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Score Bracket Distribution</h3>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distributionChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                    <Tooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
