<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\URL;

class GalleryController extends Controller
{
    
     public function index()
    {
        $images = Gallery::latest()->get();
        $images->transform(function ($image) {
            $image->url = URL::to(Storage::url($image->path));
            return $image;
        });

        $categories = Gallery::pluck('categories')->flatten()->unique()->values();
        return response()->json([
            'images' => $images,
            'categories' => $categories,
        ]);
    }

  
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'images.0' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120', 
            'metadata' => 'required|json',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $metadata = json_decode($request->metadata, true);
        $file = $request->file('images')[0];

        $path = $file->store('gallery', 'public');

        $gallery = Gallery::create([
            'filename' => $file->getClientOriginalName(),
            'path' => $path,
            'url' => Storage::url($path),
            'categories' => $metadata['categories'],
            'aspect_ratio' => $metadata['width'] / $metadata['height'],
        ]);

        return response()->json($gallery, 201);
    }

   public function destroy($id)
    {
        $image = Gallery::findOrFail($id);
        
        Storage::disk('public')->delete($image->path);
        
        $image->delete();

        return response()->json(['message' => 'Gambar berhasil dihapus.']);
    }
}