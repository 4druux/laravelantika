import React, { Suspense } from "react";
import DotLoader from "@/Components/loading/DotLoader";
import SignUpForm from "@/Components/auth/SignUpForm";


export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <DotLoader dotSize="w-5 h-5" />
        </div>
      }
    >
      <SignUpForm />
    </Suspense>
  );
}
