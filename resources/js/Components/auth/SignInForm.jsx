import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "../../Context/useAuth";
import { checkAuthStatus } from "../../utils/api";
import DotLoader from "../loading/DotLoader";

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

export default function SignInForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [authError, setAuthError] = useState("");
    const [canRegister, setCanRegister] = useState(false);
    const [isCheckingRegistrationStatus, setIsCheckingRegistrationStatus] =
        useState(true);

    const { login } = useAuth();

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const response = await checkAuthStatus();
                setCanRegister(response.canRegister);
            } catch (error) {
                console.error("Gagal memeriksa status pendaftaran:", error);
                setCanRegister(false);
            } finally {
                setIsCheckingRegistrationStatus(false);
            }
        };
        checkStatus();
    }, []);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        if (id === "email") setEmail(value);
        if (id === "password") setPassword(value);
        if (errors[id]) setErrors((prev) => ({ ...prev, [id]: "" }));
        if (authError) setAuthError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!validateEmail(email))
            newErrors.email = "Format email tidak valid.";
        if (!password) newErrors.password = "Password wajib diisi.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        setAuthError("");

        try {
            await login(email, password);
        } catch (error) {
            setAuthError(error.message || "Terjadi kesalahan saat login.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isCheckingRegistrationStatus) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <DotLoader />
            </div>
        );
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
                    Admin <span className="text-teal-500 ml-1">Login</span>
                </h1>
                <form noValidate onSubmit={handleSubmit}>
                    {authError && (
                        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                            <AlertCircle className="w-5 h-5 mr-2" />
                            <span>{authError}</span>
                        </div>
                    )}
                    <div className="mb-4">
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
                                errors.email || authError
                                    ? "border-red-500"
                                    : "border-gray-300 focus:border-teal-500"
                            }`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>
                    <div className="relative mb-4">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={handleInputChange}
                            placeholder="Password Anda"
                            className={`w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none placeholder:text-gray-400 placeholder:text-sm ${
                                errors.password || authError
                                    ? "border-red-500"
                                    : "border-gray-300 focus:border-teal-500"
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 top-6 flex items-center px-3 text-gray-500"
                        >
                            {showPassword ? (
                                <EyeOff size={20} />
                            ) : (
                                <Eye size={20} />
                            )}
                        </button>
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>
                    <p className="text-sm text-end font-medium text-teal-600 my-2 hover:underline">
                        <Link href="/forgot-password">lupa kata sandi?</Link>
                    </p>
                    <div className="flex justify-center pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-br from-teal-200 via-teal-700 to-teal-400 rounded-full hover:opacity-95 disabled:opacity-70 flex items-center justify-center transition-all"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin h-5 w-5 mr-3" />
                                    <span>Loading...</span>
                                </>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </div>
                </form>
                {canRegister && (
                    <p className="text-sm text-center text-gray-600">
                        Tidak punya akun?{" "}
                        <Link
                            href="/register"
                            className="font-medium text-teal-600 hover:underline"
                        >
                            Daftar Sekarang
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
}
