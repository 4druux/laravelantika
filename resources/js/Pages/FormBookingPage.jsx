import React, { Suspense } from "react";
import DotLoader from "@/Components/loading/DotLoader";
import FormBooking from "@/Components/booking/FormBooking";


export default function FormBookingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <DotLoader dotSize="w-5 h-5" />
        </div>
      }
    >
      <FormBooking />
    </Suspense>
  );
}
