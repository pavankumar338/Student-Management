import { getStudents } from "@/app/actions/students";
import ClientStudentList from "./ClientStudentList";

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  const students = await getStudents();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Students</h1>
        <p className="text-muted-foreground mt-1">Manage all students in the system.</p>
      </div>
      
      <ClientStudentList initialStudents={students} />
    </div>
  );
}
