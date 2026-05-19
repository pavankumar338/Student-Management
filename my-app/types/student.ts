export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  date_of_birth: string | null;
  grade: string | null;
  register_no: string | null;
  place: string | null;
  residence_type: string | null;
  enrollment_date: string;
  created_at: string;
  updated_at: string;
}

export type CreateStudentInput = Omit<Student, 'id' | 'created_at' | 'updated_at' | 'enrollment_date'>;
export type UpdateStudentInput = Partial<CreateStudentInput>;
