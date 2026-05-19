import { supabase } from "@/lib/supabase";
import { Student } from "@/types/student";
import PerformanceAnalytics from "@/components/dashboard/PerformanceAnalytics";
import AttendanceAnalytics from "@/components/analytics/AttendanceAnalytics";
import ClientAnalyticsTabs from "./ClientAnalyticsTabs";
import { BarChart3 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AnalyticsDashboardPage() {
  // 1. Fetch Students
  const { data: studentsData } = await supabase
    .from("students")
    .select("*")
    .order("first_name");

  // 2. Fetch Exams for Performance Charts
  const { data: examResults } = await supabase
    .from("exam_results")
    .select("*, students(first_name, last_name, grade)")
    .order("exam_date", { ascending: false });

  // 3. Fetch Attendance records
  const { data: attendanceData } = await supabase
    .from("attendance")
    .select("*")
    .order("date", { ascending: false });

  const students = (studentsData as Student[]) || [];
  const exams = (examResults as any[]) || [];
  const attendance = (attendanceData as any[]) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <BarChart3 className="text-primary" /> Performance & Attendance Analytics
        </h1>
        <p className="text-muted-foreground mt-1">
          Deep visual inspection of grade-wise academic achievements and attendance trends.
        </p>
      </div>

      <ClientAnalyticsTabs 
        performanceComponent={<PerformanceAnalytics examResults={exams} />}
        attendanceComponent={<AttendanceAnalytics attendanceData={attendance} studentsData={students} />}
      />
    </div>
  );
}
