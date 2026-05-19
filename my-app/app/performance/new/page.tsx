import PerformanceForm from "@/components/performance/PerformanceForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewPerformancePage({ searchParams }: { searchParams: { student_id?: string } }) {
  const { student_id } = await searchParams;
  
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <Link href="/performance" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
          <ArrowLeft size={16} /> Back to Performance
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Add Exam Marks</h1>
        <p className="text-muted-foreground mt-1">Record new examination results for a student.</p>
      </div>

      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
        <PerformanceForm preselectedStudentId={student_id} />
      </div>
    </div>
  );
}
