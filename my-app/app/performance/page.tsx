import { getExamResults } from "@/app/actions/performance";
import Link from "next/link";
import { Plus, TrendingUp, Award, BookOpen } from "lucide-react";
import { format } from "date-fns";
import ClientPerformanceList from "./ClientPerformanceList";

export const dynamic = "force-dynamic";

export default async function PerformancePage() {
  const results = await getExamResults();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <TrendingUp className="text-primary" /> Performance
          </h1>
          <p className="text-muted-foreground mt-1">Track examination marks and student academic progress.</p>
        </div>
        <Link 
          href="/performance/new" 
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-all"
        >
          <Plus size={18} /> Add Marks
        </Link>
      </div>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="bg-accent/10 p-4 rounded-full text-accent">
            <Award size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Exams Recorded</p>
            <p className="text-3xl font-bold">{results.length}</p>
          </div>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="bg-purple-500/10 p-4 rounded-full text-purple-500">
            <BookOpen size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Recent Activity</p>
            <p className="text-xl font-bold">{results.length > 0 ? format(new Date(results[0].created_at), "MMM d, yyyy") : "N/A"}</p>
          </div>
        </div>
      </div>

      {/* List of Performances with Filters */}
      <ClientPerformanceList initialResults={results} />
    </div>
  );
}
