"use client";

import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { getAttendanceForDate, setAttendance as setAttendanceAction } from "@/app/actions/attendance";
import { Student } from "@/types/student";
import { AttendanceRecord } from "@/types/attendance";
import { Check, X, Clock, Calendar as CalendarIcon, Loader2 } from "lucide-react";

interface ClientAttendanceTrackerProps {
  initialStudents: Student[];
  initialAttendance: AttendanceRecord[];
}

export default function ClientAttendanceTracker({ initialStudents, initialAttendance }: ClientAttendanceTrackerProps) {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  // Unique Grades for filtering
  const gradeOptions = useMemo(() => {
    const grades = initialStudents.map(s => s.grade).filter(Boolean) as string[];
    return ["All", ...Array.from(new Set(grades))];
  }, [initialStudents]);

  // Filter students by selected Grade
  const filteredStudents = useMemo(() => {
    if (selectedGrade === "All") return initialStudents;
    return initialStudents.filter(s => s.grade === selectedGrade);
  }, [initialStudents, selectedGrade]);

  // Fetch attendance records specifically for the chosen date
  useEffect(() => {
    let isMounted = true;
    const fetchAttendance = async () => {
      const data = await getAttendanceForDate(selectedDate);
      if (isMounted && data) {
        setAttendance(data);
      }
    };
    fetchAttendance();
    return () => {
      isMounted = false;
    };
  }, [selectedDate]);

  // Find attendance status for a student on current date
  const getStudentStatus = (studentId: string) => {
    const record = attendance.find(r => r.student_id === studentId);
    return record ? record.status : null;
  };

  // Triggered when a teacher clicks Present, Absent, or Late
  const markAttendance = async (studentId: string, status: "Present" | "Absent" | "Late") => {
    // Set loading state for this specific student row
    setLoadingMap(prev => ({ ...prev, [studentId]: true }));

    try {
      const res = await setAttendanceAction(studentId, selectedDate, status);
      if (res.success) {
        if (res.action === "deleted") {
          setAttendance(prev => prev.filter(r => r.student_id !== studentId));
        } else if (res.action === "updated" && res.data) {
          setAttendance(prev => prev.map(r => r.student_id === studentId ? (res.data as AttendanceRecord) : r));
        } else if (res.action === "created" && res.data) {
          setAttendance(prev => [...prev.filter(r => r.student_id !== studentId), res.data as AttendanceRecord]);
        }
      } else {
        alert("Failed to update attendance: " + (res.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMap(prev => ({ ...prev, [studentId]: false }));
    }
  };

  // Stats Calculations
  const stats = useMemo(() => {
    const activeStudentIds = new Set(filteredStudents.map(s => s.id));
    const records = attendance.filter(r => activeStudentIds.has(r.student_id));
    
    const total = filteredStudents.length;
    const present = records.filter(r => r.status === "Present").length;
    const absent = records.filter(r => r.status === "Absent").length;
    const late = records.filter(r => r.status === "Late").length;
    const unmarked = total - records.length;
    
    const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

    return { total, present, absent, late, unmarked, rate };
  }, [filteredStudents, attendance]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Date Picker and Grade Filters */}
      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full md:w-auto">
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full sm:w-auto pl-10 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium"
            />
          </div>

          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium"
          >
            {gradeOptions.map(grade => (
              <option key={grade} value={grade}>{grade === "All" ? "All Grades" : grade}</option>
            ))}
          </select>
        </div>

        {/* Dynamic summary */}
        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase">Daily Attendance Rate</p>
            <p className={`text-3xl font-extrabold ${stats.rate >= 80 ? 'text-green-600' : 'text-amber-500'}`}>
              {stats.rate}%
            </p>
          </div>
          <div className="flex gap-4 text-xs font-medium">
            <div className="text-center">
              <span className="block text-green-600 font-bold text-lg">{stats.present}</span>
              <span className="text-muted-foreground">Present</span>
            </div>
            <div className="text-center">
              <span className="block text-red-500 font-bold text-lg">{stats.absent}</span>
              <span className="text-muted-foreground">Absent</span>
            </div>
            <div className="text-center">
              <span className="block text-amber-500 font-bold text-lg">{stats.late}</span>
              <span className="text-muted-foreground">Late</span>
            </div>
          </div>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-lg">Daily Attendance Roster</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground text-sm border-b border-border">
                <th className="px-6 py-4 font-medium w-1/3">Student Name</th>
                <th className="px-6 py-4 font-medium">Register No</th>
                <th className="px-6 py-4 font-medium">Grade</th>
                <th className="px-6 py-4 font-medium text-right pr-12">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    No students found for the selected grade filter.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const status = getStudentStatus(student.id);
                  const isLoading = loadingMap[student.id];

                  return (
                    <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">
                        {student.first_name} {student.last_name}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground font-mono text-sm">
                        {student.register_no || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                          {student.grade || "Unassigned"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right pr-8">
                        <div className="inline-flex items-center gap-2">
                          {isLoading && <Loader2 size={16} className="animate-spin text-muted-foreground mr-2" />}
                          
                          {/* Present Button */}
                          <button
                            onClick={() => markAttendance(student.id, "Present")}
                            disabled={isLoading}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                              status === "Present"
                                ? "bg-green-600 text-white border-green-600 shadow-sm"
                                : "bg-background text-muted-foreground border-border hover:bg-muted"
                            }`}
                          >
                            <Check size={14} /> Present
                          </button>

                          {/* Absent Button */}
                          <button
                            onClick={() => markAttendance(student.id, "Absent")}
                            disabled={isLoading}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                              status === "Absent"
                                ? "bg-red-500 text-white border-red-500 shadow-sm"
                                : "bg-background text-muted-foreground border-border hover:bg-muted"
                            }`}
                          >
                            <X size={14} /> Absent
                          </button>

                          {/* Late Button */}
                          <button
                            onClick={() => markAttendance(student.id, "Late")}
                            disabled={isLoading}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                              status === "Late"
                                ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                                : "bg-background text-muted-foreground border-border hover:bg-muted"
                            }`}
                          >
                            <Clock size={14} /> Late
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
