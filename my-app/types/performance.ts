import { Student } from "./student";

export interface ExamResult {
  id: string;
  student_id: string;
  exam_name: string;
  subject: string;
  marks_obtained: number;
  total_marks: number;
  exam_date: string;
  created_at: string;
  
  // Optional join field
  students?: Student;
}

export type CreateExamResultInput = Omit<ExamResult, 'id' | 'created_at' | 'students'>;
