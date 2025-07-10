import React, { Suspense } from "react";
import DotLoader from "@/Components/loading/DotLoader";
import KelolaGaleri from "@/Components/admin/kelola-galeri/KelolaGaleri";


export default function KelolaGaleriPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full">
          <DotLoader />
        </div>
      }
    >
      <KelolaGaleri />
    </Suspense>
  );
}
