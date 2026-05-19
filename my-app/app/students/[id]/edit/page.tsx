import StudentForm from "@/components/students/StudentForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Student } from "@/types/student";

export default async function EditStudentPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const { data: student, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !student) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <Link href="/students" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
          <ArrowLeft size={16} /> Back to Students
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Student</h1>
        <p className="text-muted-foreground mt-1">Update details for {student.first_name} {student.last_name}.</p>
      </div>

      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
        <StudentForm initialData={student as Student} />
      </div>
    </div>
  );
}
