import { getStudents } from "@/app/actions/students";
import { getExamResults } from "@/app/actions/performance";
import { getAllAttendance } from "@/app/actions/attendance";
import PerformanceAnalytics from "@/components/dashboard/PerformanceAnalytics";
import AttendanceAnalytics from "@/components/analytics/AttendanceAnalytics";
import ClientAnalyticsTabs from "./ClientAnalyticsTabs";
import { BarChart3 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AnalyticsDashboardPage() {
  const [students, exams, attendance] = await Promise.all([
    getStudents(),
    getExamResults(),
    getAllAttendance(),
  ]);

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
