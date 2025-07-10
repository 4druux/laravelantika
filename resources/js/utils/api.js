const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export const fetcher = async ([url, token]) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}${url}`, { headers });
  return handleResponse(response);
};

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorData = null;
    let errorMessage = response.statusText || "Terjadi kesalahan pada server.";

    try {
      errorData = await response.json();
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }

    if (response.status === 422) {
      if (errorData && errorData.errors) {
        const validationErrors = Object.values(errorData.errors).flat();
        errorMessage = validationErrors[0] || "Validasi gagal.";
      } else if (errorData && errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData && Object.keys(errorData).length > 0) {
        const firstFieldErrorKey = Object.keys(errorData)[0];
        if (
          Array.isArray(errorData[firstFieldErrorKey]) &&
          errorData[firstFieldErrorKey].length > 0
        ) {
          errorMessage = errorData[firstFieldErrorKey][0];
        } else {
          errorMessage = response.statusText || "Format data tidak valid.";
        }
      } else {
        errorMessage = response.statusText || "Data tidak dapat diproses.";
      }
    } else if (errorData && errorData.message) {
      errorMessage = errorData.message;
    } else {
      errorMessage = response.statusText || "Terjadi kesalahan pada server.";
    }

    throw new Error(errorMessage);
  }
  return response.json();
};

// Booking
export const createBooking = async (bookingData) => {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(bookingData),
  });
  return handleResponse(response);
};

export const getBooking = async (publicId) => {
  const response = await fetch(`${API_BASE_URL}/bookings/${publicId}`);
  return handleResponse(response);
};

export const getPublicBookedDates = async () => {
  const response = await fetch(`${API_BASE_URL}/bookings/public/dates`);
  return handleResponse(response);
};

export const getAdminBookings = async (token) => {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const updateBookingStatus = async (publicId, status, token) => {
  const encodedPublicId = encodeURIComponent(publicId);
  const response = await fetch(
    `${API_BASE_URL}/bookings/${encodedPublicId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }
  );
  return handleResponse(response);
};

// Gallery
export const getGallery = async (token) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/gallery`, { headers });
  return handleResponse(response);
};

export const uploadImage = async (formData, token) => {
  const headers = {
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/gallery`, {
    method: "POST",
    headers: headers,
    body: formData,
  });
  return handleResponse(response);
};

export const deleteImage = async (filename, token) => {
  const headers = {
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}/gallery/${encodeURIComponent(filename)}`,
    {
      method: "DELETE",
      headers: headers,
    }
  );
  return handleResponse(response);
};

// Auth
export const checkAuthStatus = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/check`);
  return handleResponse(response);
};

export const register = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

export const login = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

export const logout = async (token) => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return handleResponse(response);
};

export const forgotPassword = async (email) => {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email }),
  });
  return handleResponse(response);
};

export const resetPassword = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};
