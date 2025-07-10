import { Users, Star, Crown, Rocket } from "lucide-react";

export const schedulePackages = [
  {
    icon: Star,
    title: "Paket Pelajar",
    features: [
      "1 Orang",
      "Durasi Foto 5 Menit",
      "All Soft File via GDrive (berlaku 1 hari)",
    ],
    price: "Rp 10.000",
    query: "pelajar",
  },
  {
    icon: Users,
    title: "Paket Standar",
    features: [
      "3 Orang",
      "Durasi Foto 15 Menit",
      "All Soft File via GDrive (berlaku 3 hari)",
      "Free Cetak Foto",
    ],
    price: "Rp 45.000",
    query: "standar",
  },
  {
    icon: Crown,
    title: "Paket Medium",
    features: [
      "5 Orang",
      "Durasi Foto 20 Menit",
      "All Soft File via GDrive (berlaku 7 hari)",
      "Free Cetak Foto",
    ],
    price: "Rp 100.000",
    query: "medium",
  },
  {
    icon: Rocket,
    title: "Paket Pro",
    features: [
      "8 Orang",
      "Durasi Foto 25 Menit",
      "Free Custom & 3 Spot Foto",
      "Free Wifi & Fotografer",
      "Termasuk Jasa Edit",
      "All Soft File via GDrive (berlaku 1 bulan)",
      "Free Cetak Foto",
    ],
    price: "Rp 160.000",
    query: "pro",
  },
];
