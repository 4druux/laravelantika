<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('HomePage');
});

Route::get('/formulir', function () {
    return Inertia::render('FormBookingPage');
});

Route::get('/booking', function () {
    return Inertia::render('BookingPage');
});

Route::get('/login', function () {
    return Inertia::render('LoginPage');
})->name('login'); 

Route::get('/register', function () {
    return Inertia::render('RegisterPage');
})->name('register');

Route::get('/forgot-password', function () {
    return Inertia::render('ForgotPasswordPage');
})->name('password.request');

Route::get('/reset-password/{token}', function (string $token) {
    return Inertia::render('ResetPasswordPage', ['token' => $token, 'email' => request()->email]);
})->name('password.reset');


Route::middleware(['auth'])->group(function () {
   
    Route::get('/admin/booking', function () {
        return Inertia::render('admin/BookingPage');
    });
    Route::get('/admin/upload-gambar', function () {
        return Inertia::render('admin/UploadGambarPage');
    });
    Route::get('/admin/kelola-galeri', function () {
        return Inertia::render('admin/KelolaGaleriPage');
    });
});

