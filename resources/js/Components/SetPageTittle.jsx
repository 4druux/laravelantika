import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const pageTitles = {
  "/": "Antika Studio",
  "/formulir": "Formulir Booking - Antika Studio",
  "/booking": "Detail Booking - Antika Studio",
  "/login": "Admin Login - Antika Studio",
  "/register": "Admin Register - Antika Studio",
  "/forgot-password": "Lupa Password - Antika Studio",
  "/reset-password": "Reset Password - Antika Studio",
  "/admin/booking": "Kelola Booking - Antika Studio",
  "/admin/upload-gambar": "Upload Gambar - Antika Studio",
  "/admin/kelola-galeri": "Kelola Galeri - Antika Studio",
};

function SetPageTitle() {
  const location = useLocation();

  useEffect(() => {
    const title =
      pageTitles[location.pathname] || "Page Not Found - Antika Studio";
    document.title = title;
  }, [location.pathname]);

  return null;
}

export default SetPageTitle;
