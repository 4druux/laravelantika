import React, { Suspense } from "react";
import AdminBooking from "@/Components/admin/booking/AdminBooking";
import DotLoader from "@/Components/loading/DotLoader";


export default function RequestBookingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full">
          <DotLoader />
        </div>
      }
    >
      <AdminBooking />
    </Suspense>
  );
}
