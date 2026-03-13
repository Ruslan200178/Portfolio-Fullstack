<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\About;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AboutController extends Controller
{
    public function show()
    {
        $about = About::first();
        return response()->json(['success' => true, 'data' => $about]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'name'          => 'nullable|string|max:255',
            'title'         => 'nullable|string|max:255',
            'subtitle'      => 'nullable|string|max:255',
            'description'   => 'nullable|string',
            'email'         => 'nullable|email|max:255',
            'phone'         => 'nullable|string|max:50',
            'location'      => 'nullable|string|max:255',
            'available'     => 'nullable|string|max:255',
            'github_url'    => 'nullable|string|max:255',
            'linkedin_url'  => 'nullable|string|max:255',
            'twitter_url'   => 'nullable|string|max:255',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'cv_file'       => 'nullable|mimes:pdf,doc,docx|max:5120',
        ]);

        $about = About::firstOrCreate(['id' => 1]);

        $data = $request->only([
            'name', 'title', 'subtitle', 'description',
            'email', 'phone', 'location', 'available',
            'github_url', 'linkedin_url', 'twitter_url',
        ]);

        // Allow saving empty string to clear a field — only skip null
        $data = array_filter($data, fn($v) => $v !== null);

        if ($request->hasFile('profile_image')) {
            if ($about->profile_image) Storage::disk('public')->delete($about->profile_image);
            $data['profile_image'] = $request->file('profile_image')->store('about', 'public');
        }

        if ($request->hasFile('cv_file')) {
            if ($about->cv_file) Storage::disk('public')->delete($about->cv_file);
            $data['cv_file'] = $request->file('cv_file')->store('cv', 'public');
        }

        $about->update($data);

        return response()->json([
            'success' => true,
            'message' => 'About section updated successfully!',
            'data'    => $about->fresh(),
        ]);
    }
}
