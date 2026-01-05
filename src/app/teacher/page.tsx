import { TeacherInterface } from './teacher-interface';

export default function TeacherPage() {
  return (
    <main className="container max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-serif text-center mb-2">Teacher Analytics</h1>
      <p className="text-slate-600 text-center mb-8">
        Analyze student comprehension and identify learning patterns
      </p>
      <TeacherInterface />
    </main>
  );
}


