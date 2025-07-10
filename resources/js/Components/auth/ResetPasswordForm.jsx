import { useState } from "react";
import { Link } from "@inertiajs/react";
import { Loader2, Mail, AlertCircle, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Format email tidak valid.");
      return;
    }

    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccessMessage(
        "Jika email Anda terdaftar, instruksi untuk mereset password telah dikirim."
      );
      toast.success("Link reset password telah dikirim.");
      setEmail("");
    } catch (err) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-2">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl border border-gray-100 shadow-md">
        <Link href="/">
          <img
            src="/images/logo.png"
            alt="logo antika studio"
            className="mx-auto w-[150px] h-[40px] object-cover"
          />
        </Link>

        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-600">
            Lupa <span className="text-teal-500">Password</span>
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            {!successMessage
              ? "Masukkan email Anda dan kami akan mengirimkan instruksi untuk mereset password."
              : "Silakan periksa kotak masuk email Anda."}
          </p>
        </div>

        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          )}
          {successMessage && (
            <div className="p-3 text-sm text-green-700 bg-green-100 rounded-lg flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>{successMessage}</span>
            </div>
          )}

          {!successMessage && (
            <>
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none border-gray-300 focus:border-teal-500 placeholder:text-gray-400 placeholder:text-sm"
                    placeholder="email@anda.com"
                  />
                </div>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-br from-teal-200 via-teal-700 to-teal-400 rounded-full hover:opacity-95 disabled:opacity-70 flex items-center justify-center transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-3" />
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    "Kirim Link Reset"
                  )}
                </button>
              </div>
            </>
          )}
        </form>
        <p className="text-sm text-center text-gray-600">
          Ingat password Anda?{" "}
          <Link
            href="/login"
            className="font-medium text-teal-600 hover:underline"
          >
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
