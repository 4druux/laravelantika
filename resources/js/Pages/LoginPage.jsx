import React, { Suspense } from "react";
import DotLoader from "@/Components/loading/DotLoader";
import SignInForm from "@/Components/auth/SignInForm";


export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <DotLoader dotSize="w-5 h-5" />
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
