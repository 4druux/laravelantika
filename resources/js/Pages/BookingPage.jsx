import React, { Suspense } from "react";
import Booking from "@/Components/booking/Booking";
import DotLoader from "@/Components/loading/DotLoader";


export default function FormBookingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <DotLoader dotSize="w-5 h-5" />
        </div>
      }
    >
      <Booking />
    </Suspense>
  );
}
