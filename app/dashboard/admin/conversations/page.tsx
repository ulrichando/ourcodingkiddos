import { Suspense } from "react";
import AdminLayout from "../../../../components/admin/AdminLayout";
import ConversationsMonitor from "./ConversationsMonitor";
import { Loader2 } from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';




function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
    </div>
  );
}

export default function AdminConversationsPage() {
  return (
    <AdminLayout>
      <Suspense fallback={<LoadingFallback />}>
        <ConversationsMonitor />
      </Suspense>
    </AdminLayout>
  );
}
