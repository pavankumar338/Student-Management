"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Search, Download } from "lucide-react";

interface ClientPerformanceListProps {
  initialResults: any[];
}

export default function ClientPerformanceList({ initialResults }: ClientPerformanceListProps) {
  const [examFilter, setExamFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [search, setSearch] = useState("");

  const handleExport = () => {
    const headers = ["Student Name", "Register No", "Grade", "Exam Name", "Subject", "Marks Obtained", "Total Marks", "Exam Date"];
    const csvContent = [
      headers.join(","),
      ...filteredResults.map(result => [
        `${result.students?.first_name || ""} ${result.students?.last_name || ""}`,
        result.students?.register_no || "",
        result.students?.grade || "",
        result.exam_name,
        result.subject,
        result.marks_obtained,
        result.total_marks,
        result.exam_date
      ].map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `performance_report_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const uniqueSubjects = useMemo(() => {
    const subjects = initialResults.map(r => r.subject).filter(Boolean);
    return Array.from(new Set(subjects)).sort();
  }, [initialResults]);

  const filteredResults = useMemo(() => {
    return initialResults.filter(result => {
      const matchExam = !examFilter || result.exam_name === examFilter;
      const matchGrade = !gradeFilter || result.students?.grade === gradeFilter;
      const matchSubject = !subjectFilter || result.subject === subjectFilter;
      
      const searchLower = search.toLowerCase();
      const fullName = `${result.students?.first_name || ""} ${result.students?.last_name || ""}`.toLowerCase();
      const regNo = (result.students?.register_no || "").toLowerCase();
      const matchSearch = !search || fullName.includes(searchLower) || regNo.includes(searchLower);

      return matchExam && matchGrade && matchSubject && matchSearch;
    });
  }, [initialResults, examFilter, gradeFilter, subjectFilter, search]);

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h2 className="font-semibold text-lg whitespace-nowrap">Recent Exam Results</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search name or reg no..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>

          <select 
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          >
            <option value="">All Grades</option>
            <option value="9th Grade">9th Grade</option>
            <option value="10th Grade">10th Grade</option>
            <option value="11th Grade">11th Grade</option>
            <option value="12th Grade">12th Grade</option>
          </select>
          
          <select 
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          >
            <option value="">All Subjects</option>
            {uniqueSubjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>

          <select 
            value={examFilter}
            onChange={(e) => setExamFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          >
            <option value="">All Examinations</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Half-Yearly">Half-Yearly</option>
            <option value="Final Examinations">Final Examinations</option>
          </select>

          <button 
            onClick={handleExport}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 border border-primary text-primary rounded-xl font-medium hover:bg-primary/5 transition-all text-sm"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 text-muted-foreground text-sm border-b border-border">
              <th className="px-6 py-4 font-medium">Student Name</th>
              <th className="px-6 py-4 font-medium">Exam</th>
              <th className="px-6 py-4 font-medium">Subject</th>
              <th className="px-6 py-4 font-medium">Marks</th>
              <th className="px-6 py-4 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredResults.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  No performance records found for the selected filter.
                </td>
              </tr>
            ) : (
              filteredResults.map((result) => (
                <tr key={result.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">
                      {result.students?.first_name} {result.students?.last_name}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {result.students?.register_no || "No Reg No"}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                      {result.exam_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{result.subject}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${result.marks_obtained / result.total_marks >= 0.4 ? 'text-green-600' : 'text-red-600'}`}>
                        {result.marks_obtained}
                      </span>
                      <span className="text-muted-foreground text-sm">/ {result.total_marks}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-sm">
                    {format(new Date(result.exam_date), "MMM d, yyyy")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
