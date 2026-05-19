import StudentForm from "@/components/students/StudentForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewStudentPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <Link href="/students" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
          <ArrowLeft size={16} /> Back to Students
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Add New Student</h1>
        <p className="text-muted-foreground mt-1">Enter the student's details below.</p>
      </div>

      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
        <StudentForm />
      </div>
    </div>
  );
}
