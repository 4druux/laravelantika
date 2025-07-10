import React, { createContext, useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import { login as apiLogin, logout as apiLogout } from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
        try {
            const storedToken = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Gagal memuat sesi dari localStorage", error);
            localStorage.clear();
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const data = await apiLogin({ email, password });

            setUser(data.user);
            setToken(data.access_token);

            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.access_token);

            toast.success(data.message);

            router.visit("/admin/booking");
        } catch (error) {
            toast.error(error.message || "Login gagal.");
            throw error;
        }
    };

    const logout = async () => {
        try {
            if (token) {
                await apiLogout(token);
            }
            toast.success("Logout berhasil!");
        } catch (error) {
            console.error(
                "Gagal logout di server, tetap logout di client.",
                error
            );
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            router.visit("/login", { replace: true });
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext };
