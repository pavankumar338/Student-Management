"use client";

import { useState, useMemo } from "react";
import { Student } from "@/types/student";
import { Search, Edit, Trash2, Eye, Plus, Download } from "lucide-react";
import Link from "next/link";
import { deleteStudent } from "@/app/actions/students";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface ClientStudentListProps {
  initialStudents: Student[];
}

export default function ClientStudentList({ initialStudents }: ClientStudentListProps) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();

  const handleExport = () => {
    const headers = ["Register No", "First Name", "Last Name", "Email", "Grade", "Residence Type", "Place", "Enrollment Date"];
    const csvContent = [
      headers.join(","),
      ...filteredStudents.map(student => [
        student.register_no || "",
        student.first_name,
        student.last_name,
        student.email || "",
        student.grade || "",
        student.residence_type || "",
        student.place || "",
        student.enrollment_date || ""
      ].map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `students_report_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch = 
        student.first_name.toLowerCase().includes(search.toLowerCase()) ||
        student.last_name.toLowerCase().includes(search.toLowerCase()) ||
        (student.email?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        (student.register_no?.toLowerCase().includes(search.toLowerCase()) ?? false);
      
      const matchesGrade = gradeFilter ? student.grade === gradeFilter : true;
      
      return matchesSearch && matchesGrade;
    });
  }, [students, search, gradeFilter]);

  const uniqueGrades = Array.from(new Set(students.map(s => s.grade).filter(Boolean))) as string[];

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    
    setIsDeleting(id);
    const result = await deleteStudent(id);
    
    if (!result.success) {
      alert("Error deleting student: " + (result.error || "Failed to delete"));
    } else {
      setStudents(students.filter(s => s.id !== id));
      router.refresh();
    }
    setIsDeleting(null);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email, or reg. no..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <select 
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="px-4 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">All Grades</option>
            {uniqueGrades.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExport}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-primary text-primary rounded-xl font-medium hover:bg-primary/5 transition-all"
          >
            <Download size={18} /> Export CSV
          </button>
          <Link href="/students/new" prefetch={false} className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-all">
            <Plus size={18} /> Add Student
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground text-sm border-b border-border">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Reg. No</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Grade</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No students found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                          {student.first_name[0]}{student.last_name[0]}
                        </div>
                        <span className="font-medium text-foreground">{student.first_name} {student.last_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono text-sm">{student.register_no || '-'}</td>
                    <td className="px-6 py-4 text-muted-foreground">{student.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent-foreground border border-accent/20">
                        {student.grade || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/students/${student.id}`} prefetch={false} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="View Details">
                          <Eye size={18} />
                        </Link>
                        <Link href={`/students/${student.id}/edit`} prefetch={false} className="p-2 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-lg transition-colors" title="Edit Student">
                          <Edit size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(student.id)}
                          disabled={isDeleting === student.id}
                          className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50" 
                          title="Delete Student"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
