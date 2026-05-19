import { Student } from "./student";

export interface AttendanceRecord {
  id: string;
  student_id: string;
  status: "Present" | "Absent" | "Late";
  date: string;
  created_at: string;
  students?: Student;
}

export type CreateAttendanceInput = Omit<AttendanceRecord, 'id' | 'created_at' | 'students'>;
