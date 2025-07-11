// resources/js/utils/api.js

import axios from "axios";

const API_BASE_URL = `${window.location.origin}/api`;

const handleAxiosResponse = (response) => response.data;
const ensureCsrfCookie = () => axios.get("/sanctum/csrf-cookie");

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
        const errorData = error.response.data;

        if (
            error.response.status === 422 &&
            (errorData.errors || errorData.email)
        ) {
            const err = new Error("Data yang diberikan tidak valid.");

            if (errorData.errors) {
                err.errors = errorData.errors;
            } else if (errorData.email) {
                err.errors = { email: errorData.email };
            }
            throw err;
        }

        const message = errorData.message || "Terjadi kesalahan pada server.";
        throw new Error(message);
    }
    throw new Error(error.message || "Tidak dapat terhubung ke server.");
};

// Auth
export const login = async (credentials) => {
    await ensureCsrfCookie();
    return axios
        .post(`${API_BASE_URL}/auth/login`, credentials)
        .then(handleAxiosResponse)
        .catch(handleAxiosError);
};

export const register = async (credentials) => {
    await ensureCsrfCookie();
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

export const forgotPassword = async (email) => {
    await ensureCsrfCookie();
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
