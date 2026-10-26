export const dynamic = "force-dynamic";

import { getStudents } from "@/app/actions/students";
import { getAttendanceForDate } from "@/app/actions/attendance";
import Link from "next/link";
import { Users, UserPlus, GraduationCap, ChevronRight, Calendar } from "lucide-react";
import { format } from "date-fns";
import AnalyticsCharts from "@/components/dashboard/AnalyticsCharts";
import { Student } from "@/types/student";

export default async function DashboardPage() {
  const todayStr = format(new Date(), "yyyy-MM-dd");

  const [allStudents, todayAttendance] = await Promise.all([
    getStudents(),
    getAttendanceForDate(todayStr),
  ]);

  const totalStudents = allStudents.length;
  const recentStudents = allStudents.slice(0, 5);
  
  const totalStu = allStudents.length;
  const presentToday = todayAttendance.filter((r) => r.status === "Present" || r.status === "Late").length;
  const attendanceRate = totalStu > 0 ? Math.round((presentToday / totalStu) * 100) : 0;
  
  // Compute active grades count
  const activeGradesCount = Array.from(new Set(allStudents.map(s => s.grade).filter(Boolean))).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your student management system.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="bg-primary/10 p-4 rounded-full text-primary">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Students</p>
            <p className="text-3xl font-bold">{totalStudents || 0}</p>
          </div>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="bg-accent/10 p-4 rounded-full text-accent">
            <UserPlus size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Recent Enrollments</p>
            <p className="text-3xl font-bold">{recentStudents?.length || 0}</p>
          </div>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="bg-purple-500/10 p-4 rounded-full text-purple-500">
            <GraduationCap size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Active Grades</p>
            <p className="text-3xl font-bold">{activeGradesCount || 0}</p>
          </div>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="bg-green-500/10 p-4 rounded-full text-green-500">
            <Calendar size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Today's Attendance</p>
            <p className="text-3xl font-bold">{attendanceRate}%</p>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      {allStudents && allStudents.length > 0 && (
        <AnalyticsCharts students={allStudents as Student[]} />
      )}



      {/* Recent Students List */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h2 className="font-semibold text-lg">Recently Added Students</h2>
          <Link href="/students" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all <ChevronRight size={16} />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {(!recentStudents || recentStudents.length === 0) ? (
            <div className="p-8 text-center text-muted-foreground">
              No students found. <Link href="/students/new" className="text-primary hover:underline">Add one now</Link>.
            </div>
          ) : (
            recentStudents.map((student) => (
              <div key={student.id} className="p-4 px-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                    {student.first_name[0]}{student.last_name[0]}
                  </div>
                  <div>
                    <p className="font-medium">{student.first_name} {student.last_name}</p>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <p className="text-muted-foreground">Enrolled on</p>
                  <p className="font-medium">{student.enrollment_date ? format(new Date(student.enrollment_date), "MMM d, yyyy") : 'N/A'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
