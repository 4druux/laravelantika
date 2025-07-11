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


Route::middleware(['auth'])->prefix('admin')->group(function () {
    
    Route::get('/', function () {
        return redirect('/admin/booking');
    });

    Route::get('/booking', function () {
        return Inertia::render('admin/BookingPage');
    })->name('admin.booking');

    Route::get('/upload-gambar', function () {
        return Inertia::render('admin/UploadGambarPage');
    })->name('admin.upload');

    Route::get('/kelola-galeri', function () {
        return Inertia::render('admin/KelolaGaleriPage');
    })->name('admin.gallery');
});


Route::fallback(function () {
    return Inertia::render('NotFoundPage');
});

