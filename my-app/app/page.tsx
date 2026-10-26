import Link from "next/link";
import { Users, BookOpen, GraduationCap, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12 md:py-24">

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Student Management</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Streamline your educational operations with our intuitive, fast, and secure student management system.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
          <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all hover:scale-105 shadow-lg shadow-primary/30">
            Go to Dashboard <ArrowRight size={20} />
          </Link>
          <Link href="/students" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-card text-foreground border border-border rounded-xl font-semibold hover:bg-muted transition-all">
            View Students
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-6 py-12">
        <div className="bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
          <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Users size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Student Directory</h3>
          <p className="text-muted-foreground">Keep all student records organized in one centralized, easily accessible database.</p>
        </div>
        <div className="bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
          <div className="h-12 w-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <BookOpen size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Grade Tracking</h3>
          <p className="text-muted-foreground">Monitor academic performance and track grades seamlessly across semesters.</p>
        </div>
        <div className="bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
          <div className="h-12 w-12 bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <GraduationCap size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Enrollment Status</h3>
          <p className="text-muted-foreground">Manage admissions, view enrollment dates, and track student statuses efficiently.</p>
        </div>
      </section>
    </div>
  );
}
