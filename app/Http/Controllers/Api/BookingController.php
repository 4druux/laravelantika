<?php
// File: app/Http/Controllers/Api/BookingController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;


class BookingController extends Controller
{
    
    public function index()
    {
        return Booking::latest()->get();
    }

 
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'telepon' => 'required|string|max:20',
            'paket' => 'required|string|max:255',
            'tanggal' => 'required|date_format:Y-m-d H:i:s', 
            'catatan' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        
        $publicId = 'FOTO-' . strtoupper(Str::random(9));

        Booking::create([
            'public_id' => $publicId,
            'nama' => $request->nama,
            'telepon' => $request->telepon,
            'paket' => $request->paket,
            'tanggal_booking' => $request->tanggal, 
            'catatan' => $request->catatan,
        ]);

        $newBooking = Booking::where('public_id', $publicId)->first();

        return response()->json([
            'message' => 'Booking berhasil dibuat!',
            'booking' => $newBooking 
        ], 201);
    }

  
    public function show($public_id)
    {
        $booking = Booking::where('public_id', $public_id)->firstOrFail();
        return response()->json($booking);
    }

     public function getPublicBookedDates()
    {
        $bookedDates = Booking::where('status', '!=', 'CANCELLED')
        ->pluck('tanggal_booking');

        return response()->json($bookedDates);
    }

     public function updateStatus(Request $request, $public_id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:PENDING,CONFIRMED,CANCELLED',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $booking = Booking::where('public_id', $public_id)->firstOrFail();
        

        $booking->update([
            'status' => $request->status
        ]);

        return response()->json([
            'message' => 'Status booking berhasil diperbarui.',
            'booking' => $booking->fresh() 
        ]);
    }
}