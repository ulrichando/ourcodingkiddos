import { Suspense } from "react";
import InstructorLayout from "../../../../components/instructor/InstructorLayout";
import MessagesContent from "./MessagesContent";
import { Loader2 } from "lucide-react";

function MessagesLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
    </div>
  );
}

export default function InstructorMessagesPage() {
  return (
    <InstructorLayout>
      <Suspense fallback={<MessagesLoadingFallback />}>
        <MessagesContent />
      </Suspense>
    </InstructorLayout>
  );
}
