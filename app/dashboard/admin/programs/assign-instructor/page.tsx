import { Suspense } from "react";
import AdminLayout from "../../../../../components/admin/AdminLayout";
import InstructorAssignment from "./InstructorAssignment";
import { Loader2 } from "lucide-react";

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
    </div>
  );
}

export default function AssignInstructorPage() {
  return (
    <AdminLayout>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Suspense fallback={<LoadingFallback />}>
          <InstructorAssignment />
        </Suspense>
      </main>
    </AdminLayout>
  );
}
