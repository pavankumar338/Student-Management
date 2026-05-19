-- SQL to create the students table in Supabase
-- Go to your Supabase project -> SQL Editor -> New Query, paste this and click Run

CREATE TABLE public.students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    date_of_birth DATE,
    grade TEXT,
    register_no TEXT,
    place TEXT,
    residence_type TEXT,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- If you ALREADY created the table, you can run these ALTER statements instead:
-- ALTER TABLE public.students ADD COLUMN register_no TEXT;
-- ALTER TABLE public.students ADD COLUMN place TEXT;
-- ALTER TABLE public.students ADD COLUMN residence_type TEXT;

-- Enable RLS (Optional but recommended, we will allow all access for this simple project)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access" ON public.students
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert access" ON public.students
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update access" ON public.students
    FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous delete access" ON public.students
    FOR DELETE USING (true);

-- SQL to create the exam_results table
CREATE TABLE public.exam_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    exam_name TEXT NOT NULL,
    subject TEXT NOT NULL,
    marks_obtained NUMERIC NOT NULL,
    total_marks NUMERIC NOT NULL,
    exam_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access on exam_results" ON public.exam_results FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access on exam_results" ON public.exam_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update access on exam_results" ON public.exam_results FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete access on exam_results" ON public.exam_results FOR DELETE USING (true);

-- SQL to create the attendance table
CREATE TABLE public.attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Present', 'Absent', 'Late')),
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (student_id, date)
);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access on attendance" ON public.attendance FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access on attendance" ON public.attendance FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update access on attendance" ON public.attendance FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete access on attendance" ON public.attendance FOR DELETE USING (true);

