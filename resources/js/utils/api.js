// resources/js/utils/api.js

import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const handleAxiosResponse = (response) => response.data;

export const fetcher = ([url, token]) => {
    const headers = {
        Accept: "application/json",
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return axios
        .get(`${API_BASE_URL}${url}`, { headers })
        .then((res) => res.data);
};

const handleAxiosError = (error) => {
    if (error.response && error.response.data) {
        // Mengambil pesan error dari backend
        const errorData = error.response.data;
        const message = errorData.message || "Terjadi kesalahan.";

        if (error.response.status === 422 && errorData.errors) {
            // Mengambil error validasi pertama
            const firstError = Object.values(errorData.errors)[0][0];
            throw new Error(firstError || message);
        }
        throw new Error(message);
    }
    // Error jaringan atau lainnya
    throw new Error(error.message || "Tidak dapat terhubung ke server.");
};

// auth
// Auth
export const login = (credentials) => {
    return axios
        .post(`${API_BASE_URL}/auth/login`, credentials)
        .then(handleAxiosResponse)
        .catch(handleAxiosError);
};

export const register = (credentials) => {
    return axios
        .post(`${API_BASE_URL}/auth/register`, credentials)
        .then(handleAxiosResponse)
        .catch(handleAxiosError);
};

export const logout = (token) => {
    return axios
        .post(
            `${API_BASE_URL}/auth/logout`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        )
        .then(handleAxiosResponse)
        .catch(handleAxiosError);
};

export const forgotPassword = (email) => {
    return axios
        .post(`${API_BASE_URL}/auth/forgot-password`, { email })
        .then(handleAxiosResponse)
        .catch(handleAxiosError);
};

export const resetPassword = (credentials) => {
    return axios
        .post(`${API_BASE_URL}/auth/reset-password`, credentials)
        .then(handleAxiosResponse)
        .catch(handleAxiosError);
};

export const checkAuthStatus = () => {
    return axios
        .get(`${API_BASE_URL}/auth/check`)
        .then(handleAxiosResponse)
        .catch(handleAxiosError);
};

// Booking
export const createBooking = (bookingData) => {
    return axios
        .post(`${API_BASE_URL}/bookings`, bookingData)
        .then(handleAxiosResponse)
        .catch(handleAxiosError);
};

export const getBooking = (publicId) => {
    return axios
        .get(`${API_BASE_URL}/bookings/${publicId}`)
        .then(handleAxiosResponse)
        .catch(handleAxiosError);
};

export const getPublicBookedDates = () => {
    return axios
        .get(`${API_BASE_URL}/bookings/public/dates`)
        .then(handleAxiosResponse)
        .catch(handleAxiosError);
};

export const getAdminBookings = (token) => {
    return axios
        .get(`${API_BASE_URL}/bookings`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(handleAxiosResponse)
        .catch(handleAxiosError);
};

export const updateBookingStatus = (publicId, status, token) => {
    return axios
        .patch(
            `${API_BASE_URL}/bookings/${encodeURIComponent(publicId)}/status`,
            { status },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        )
        .then(handleAxiosResponse)
        .catch(handleAxiosError);
};

// Gallery
export const getGallery = () => {
    return axios
        .get(`${API_BASE_URL}/gallery`)
        .then(handleAxiosResponse)
        .catch(handleAxiosError);
};

export const uploadImage = (formData, token) => {
    return axios
        .post(`${API_BASE_URL}/gallery`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        })
        .then(handleAxiosResponse)
        .catch(handleAxiosError);
};

export const deleteImage = (id, token) => {
    return axios
        .delete(`${API_BASE_URL}/gallery/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(handleAxiosResponse)
        .catch(handleAxiosError);
};
