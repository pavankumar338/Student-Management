import { getStudents } from "@/app/actions/students";
import { getAttendanceForDate } from "@/app/actions/attendance";
import ClientAttendanceTracker from "./ClientAttendanceTracker";
import { format } from "date-fns";
import { ClipboardList } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AttendancePage() {
  const today = format(new Date(), "yyyy-MM-dd");

  const [students, attendance] = await Promise.all([
    getStudents(),
    getAttendanceForDate(today),
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <ClipboardList className="text-primary" /> Attendance Tracker
        </h1>
        <p className="text-muted-foreground mt-1">Manage daily student attendance, track check-ins, and view summaries.</p>
      </div>

      <ClientAttendanceTracker initialStudents={students} initialAttendance={attendance} />
    </div>
  );
}
