import { getStudentById } from "@/app/actions/students";
import { getExamResults } from "@/app/actions/performance";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Mail, Phone, Calendar, BookOpen, Clock, MapPin, Home, Hash, TrendingUp, Plus } from "lucide-react";
import { format } from "date-fns";

export default async function StudentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Fetch student and performance in parallel
  const [student, examResults] = await Promise.all([
    getStudentById(id),
    getExamResults(id),
  ]);

  if (!student) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/students" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
            <ArrowLeft size={16} /> Back to Students
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Student Profile</h1>
        </div>
        <Link 
          href={`/students/${student.id}/edit`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl font-medium transition-colors"
        >
          <Edit size={18} /> Edit Profile
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column - Quick Info */}
        <div className="space-y-6">
          <div className="bg-card border border-border p-8 rounded-2xl shadow-sm text-center">
            <div className="h-32 w-32 mx-auto rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center text-5xl font-bold shadow-lg mb-6">
              {student.first_name[0]}{student.last_name[0]}
            </div>
            <h2 className="text-2xl font-bold text-foreground">{student.first_name} {student.last_name}</h2>
            <p className="text-muted-foreground mt-1">{student.grade || 'Grade Not Assigned'}</p>
            
            <div className="mt-6 inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-sm font-medium border border-green-500/20">
              Active Student
            </div>
          </div>
        </div>

        {/* Right Column - Detailed Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold border-b border-border pb-4 mb-4">Contact Information</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium mb-1">
                  <Mail size={16} /> Email Address
                </div>
                <p className="font-medium text-foreground">{student.email || 'Not provided'}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium mb-1">
                  <Phone size={16} /> Phone Number
                </div>
                <p className="font-medium text-foreground">{student.phone || 'Not provided'}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold border-b border-border pb-4 mb-4">Residential Details</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium mb-1">
                  <MapPin size={16} /> Place
                </div>
                <p className="font-medium text-foreground">{student.place || 'Not provided'}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium mb-1">
                  <Home size={16} /> Residence Type
                </div>
                <p className="font-medium text-foreground">{student.residence_type || 'Not provided'}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold border-b border-border pb-4 mb-4">Academic Details</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium mb-1">
                  <Hash size={16} /> Register Number
                </div>
                <p className="font-medium text-foreground">{student.register_no || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium mb-1">
                  <BookOpen size={16} /> Current Grade
                </div>
                <p className="font-medium text-foreground">{student.grade || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium mb-1">
                  <Calendar size={16} /> Date of Birth
                </div>
                <p className="font-medium text-foreground">
                  {student.date_of_birth ? format(new Date(student.date_of_birth), "MMMM d, yyyy") : 'Not provided'}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium mb-1">
                  <Clock size={16} /> Enrollment Date
                </div>
                <p className="font-medium text-foreground">
                  {student.enrollment_date ? format(new Date(student.enrollment_date), "MMMM d, yyyy") : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Performance Overview */}
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center border-b border-border pb-4 mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="text-primary" size={20} /> Performance
              </h3>
              <Link 
                href={`/performance/new?student_id=${student.id}`}
                className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-dark font-medium"
              >
                <Plus size={16} /> Add Marks
              </Link>
            </div>
            
            {examResults.length === 0 ? (
              <p className="text-muted-foreground text-center py-6 text-sm">No examination records found for this student.</p>
            ) : (
              <div className="space-y-4">
                {examResults.map((exam) => (
                  <div key={exam.id} className="flex justify-between items-center p-4 bg-muted/30 rounded-xl border border-border">
                    <div>
                      <p className="font-semibold text-foreground">{exam.exam_name}</p>
                      <p className="text-sm text-muted-foreground">{exam.subject} • {format(new Date(exam.exam_date), "MMM d, yyyy")}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${exam.marks_obtained / exam.total_marks >= 0.4 ? 'text-green-600' : 'text-red-600'}`}>
                        {exam.marks_obtained} <span className="text-sm text-muted-foreground font-normal">/ {exam.total_marks}</span>
                      </p>
                      <p className="text-xs font-medium text-muted-foreground">
                        {Math.round((exam.marks_obtained / exam.total_marks) * 100)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
