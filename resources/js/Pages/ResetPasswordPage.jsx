import React, { Suspense } from "react";
import DotLoader from "@/Components/loading/DotLoader";
import ResetPasswordForm from "@/Components/auth/ResetPasswordForm";


export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <DotLoader dotSize="w-5 h-5" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
