import Link from "next/link";
import { Home, Users, PlusCircle, LayoutDashboard, TrendingUp, Calendar, BarChart3 } from "lucide-react";
import { ReactNode } from "react";
import ThemeToggle from "@/components/layout/ThemeToggle";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r border-border shadow-sm flex flex-col hidden md:flex">
        <div className="p-6 border-b border-border">
          <Link href="/" prefetch={false} className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-2 text-white">
              <LayoutDashboard size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">EduManage</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/" prefetch={false} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors font-medium">
            <Home size={20} />
            Home
          </Link>
          <Link href="/dashboard" prefetch={false} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors font-medium">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/analytics" prefetch={false} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors font-medium">
            <BarChart3 size={20} />
            Analytics
          </Link>
          <Link href="/students" prefetch={false} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors font-medium">
            <Users size={20} />
            Students
          </Link>
          <Link href="/students/new" prefetch={false} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors font-medium">
            <PlusCircle size={20} />
            Add Student
          </Link>
          <Link href="/performance" prefetch={false} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors font-medium">
            <TrendingUp size={20} />
            Performance
          </Link>
          <Link href="/attendance" prefetch={false} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors font-medium">
            <Calendar size={20} />
            Attendance
          </Link>
        </nav>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-card border-b border-border p-4 flex items-center justify-between">
        <Link href="/" prefetch={false} className="flex items-center gap-2">
          <div className="bg-primary rounded-lg p-1.5 text-white">
            <LayoutDashboard size={20} />
          </div>
          <span className="font-bold text-lg text-foreground">EduManage</span>
        </Link>
        {/* Simple mobile nav links */}
        <nav className="flex items-center gap-4">
          <Link href="/dashboard" prefetch={false} className="text-muted-foreground hover:text-primary"><LayoutDashboard size={20} /></Link>
          <Link href="/analytics" prefetch={false} className="text-muted-foreground hover:text-primary"><BarChart3 size={20} /></Link>
          <Link href="/students" prefetch={false} className="text-muted-foreground hover:text-primary"><Users size={20} /></Link>
          <Link href="/attendance" prefetch={false} className="text-muted-foreground hover:text-primary"><Calendar size={20} /></Link>
          <Link href="/performance" prefetch={false} className="text-muted-foreground hover:text-primary"><TrendingUp size={20} /></Link>
          <Link href="/students/new" prefetch={false} className="text-muted-foreground hover:text-primary"><PlusCircle size={20} /></Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto relative pt-16 md:pt-8">
        {/* Global Floating Theme Switcher */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50 w-36 md:w-40">
          <ThemeToggle />
        </div>
        {children}
      </main>
    </div>
  );
}
