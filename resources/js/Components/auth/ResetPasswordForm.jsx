import { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { resetPassword } from "@/utils/api";

export default function ResetPasswordForm() {
    const { props } = usePage();
    const { token, email } = props;

    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        if (id === "password") setPassword(value);
        if (id === "passwordConfirmation") setPasswordConfirmation(value);
        if (errors[id]) setErrors((prev) => ({ ...prev, [id]: "" }));
        if (apiError) setApiError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!password) newErrors.password = "Password baru wajib diisi.";
        if (password.length < 6)
            newErrors.password = "Password minimal 6 karakter.";
        if (!passwordConfirmation)
            newErrors.passwordConfirmation = "Konfirmasi password wajib diisi.";
        if (password !== passwordConfirmation)
            newErrors.passwordConfirmation =
                "Password dan konfirmasi password tidak cocok.";

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        setIsLoading(true);
        setApiError("");

        const payload = {
            email: email,
            token: token,
            password: password,
            password_confirmation: passwordConfirmation,
        };

        try {
            const response = await resetPassword(payload);
            toast.success(response.message || "Password berhasil direset!");
            router.visit("/login");
        } catch (err) {
            setApiError(
                err.message || "Terjadi kesalahan saat mereset password."
            );
            toast.error(err.message || "Gagal mereset password.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="flex items-center justify-center min-h-screen px-2">
                <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl border border-gray-100 shadow-md text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                    <p className="text-xl font-semibold text-gray-700">
                        Token Tidak Valid
                    </p>
                    <p className="text-gray-500">
                        Tautan reset password tidak valid atau telah
                        kedaluwarsa. Silakan minta tautan baru.
                    </p>
                    <Link
                        href="/forgot-password"
                        className="text-teal-600 hover:underline"
                    >
                        Minta Tautan Reset Baru
                    </Link>
                </div>
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
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-gray-600">
                        Reset <span className="text-teal-500">Password</span>
                    </h1>
                    <p className="text-sm text-gray-500 mt-2">
                        Masukkan password baru Anda di bawah ini.
                    </p>
                </div>
                <form noValidate onSubmit={handleSubmit} className="space-y-4">
                    {apiError && (
                        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg flex items-center">
                            <AlertCircle className="w-5 h-5 mr-2" />
                            <span>{apiError}</span>
                        </div>
                    )}
                    <div className="relative">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium text-gray-700"
                        >
                            Password Baru
                        </label>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none placeholder:text-gray-400 placeholder:text-sm ${
                                errors.password || apiError
                                    ? "border-red-500"
                                    : "border-gray-300 focus:border-teal-500"
                            }`}
                            placeholder="Masukkan password baru"
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
                    <div className="relative">
                        <label
                            htmlFor="passwordConfirmation"
                            className="text-sm font-medium text-gray-700"
                        >
                            Konfirmasi Password
                        </label>
                        <input
                            id="passwordConfirmation"
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwordConfirmation}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none placeholder:text-gray-400 placeholder:text-sm ${
                                errors.passwordConfirmation || apiError
                                    ? "border-red-500"
                                    : "border-gray-300 focus:border-teal-500"
                            }`}
                            placeholder="Ulangi password baru"
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute inset-y-0 right-0 top-6 flex items-center px-3 text-gray-500"
                        >
                            {showConfirmPassword ? (
                                <EyeOff size={20} />
                            ) : (
                                <Eye size={20} />
                            )}
                        </button>
                        {errors.passwordConfirmation && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.passwordConfirmation}
                            </p>
                        )}
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
                                    <span>Menyimpan...</span>
                                </>
                            ) : (
                                "Reset Password"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
