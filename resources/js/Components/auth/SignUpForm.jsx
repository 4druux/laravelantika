import { useState, useEffect } from "react";
import { router, Link } from "@inertiajs/react"; 
import toast from "react-hot-toast";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import DotLoader from "../loading/DotLoader";
import SignUpNotFound from "./SignUpNotFound";
import { register, checkAuthStatus } from "../../utils/api";

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [canRegister, setCanRegister] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await checkAuthStatus();
        setCanRegister(response.canRegister);
      } catch (error) {
        console.error("Gagal memeriksa status pendaftaran:", error);
        toast.error("Gagal memeriksa status pendaftaran.");
        setCanRegister(false);
      } finally {
        setIsChecking(false);
      }
    };
    checkStatus();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "name") setName(value);
    if (id === "email") setEmail(value);
    if (id === "password") setPassword(value);
    if (id === "password_confirmation") setPasswordConfirmation(value);
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: "" }));
    if (authError) setAuthError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!name) newErrors.name = "Nama wajib diisi.";
    if (!validateEmail(email)) newErrors.email = "Format email tidak valid.";
    if (password.length < 6)
      newErrors.password = "Password minimal 6 karakter.";
    if (password !== passwordConfirmation)
      newErrors.password_confirmation = "Konfirmasi password tidak cocok.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setAuthError("");
    setErrors({});

    try {
      const response = await register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      toast.success(response.message);
      router.visit("/login");
    } catch (error) {
      if (error.message && typeof error.message === "string") {
        if (error.message.includes("Email ini sudah terdaftar.")) {
          setErrors((prev) => ({ ...prev, email: error.message }));
          setAuthError(error.message);
          toast.error(error.message);
        } else if (error.message.includes("Pendaftaran admin sudah penuh.")) {
          setAuthError(error.message);
          toast.error(error.message);
        } else {
          setAuthError(error.message);
          toast.error(error.message);
        }
      } else {
        setAuthError("Registrasi gagal.");
        toast.error("Registrasi gagal.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <DotLoader />
      </div>
    );
  }

  if (!canRegister) {
    return <SignUpNotFound />;
  }

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
        <h1 className="text-2xl font-semibold text-center text-gray-600">
          Admin <span className="text-teal-500 ml-1">Register</span>
        </h1>
        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          {authError && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{authError}</span>
            </div>
          )}
          <div>
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nama
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={handleInputChange}
              placeholder="Nama Anda"
              className={`w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none placeholder:text-gray-400 placeholder:text-sm ${
                errors.name
                  ? "border-red-500"
                  : "border-gray-300 focus:border-teal-500"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleInputChange}
              placeholder="Email Anda"
              className={`w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none placeholder:text-gray-400 placeholder:text-sm ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300 focus:border-teal-500"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="w-full">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handleInputChange}
                placeholder="Password Anda"
                className={`w-full px-4 py-2 mt-2 pr-10 border rounded-lg focus:outline-none placeholder:text-gray-400 placeholder:text-sm ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-300 focus:border-teal-500"
                }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 mt-1 right-3 transform -translate-y-1/2 text-gray-500"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div className="w-full">
            <label
              htmlFor="password_confirmation"
              className="text-sm font-medium text-gray-700"
            >
              Konfirmasi Password
            </label>

            <div className="relative">
              <input
                id="password_confirmation"
                type={showConfirmPassword ? "text" : "password"}
                value={passwordConfirmation}
                onChange={handleInputChange}
                placeholder="Ulangi Password Anda"
                className={`w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none placeholder:text-gray-400 placeholder:text-sm ${
                  errors.password_confirmation
                    ? "border-red-500"
                    : "border-gray-300 focus:border-teal-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 mt-1 right-3 transform -translate-y-1/2 text-gray-500"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.password_confirmation && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password_confirmation}
              </p>
            )}
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-br from-teal-200 via-teal-700 to-teal-400 rounded-full hover:opacity-95 disabled:opacity-70 flex items-center justify-center transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 me-3" />
                  <span>Loading...</span>
                </>
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Sudah punya akun?{" "}
          <Link
            href="/login" 
            className="font-medium text-teal-600 hover:underline"
          >
            Masuk Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}