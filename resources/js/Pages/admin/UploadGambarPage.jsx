import React, { Suspense } from "react";
import DotLoader from "@/Components/loading/DotLoader";
import UploadImg from "@/Components/admin/upload-img/UploadImg";


export default function UploadGambarPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full">
          <DotLoader />
        </div>
      }
    >
      <UploadImg />
    </Suspense>
  );
}
