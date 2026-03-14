<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::orderBy('sort_order')->orderBy('created_at', 'desc')->get();
        return response()->json(['success' => true, 'data' => $projects]);
    }

    public function show(Project $project)
    {
        return response()->json(['success' => true, 'data' => $project]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:3072',
            'demo_url'    => 'nullable|string|max:255',
            'github_url'  => 'nullable|string|max:255',
            'tags'        => 'nullable|string',
            'featured'    => 'nullable',
        ]);

 $data = [
     'title'             => $request->title,
     'short_description' => $request->short_description ?? null,
      'description'       => $request->description ?: null,
      'demo_url'          => $this->cleanUrl($request->demo_url),
     'github_url'        => $this->cleanUrl($request->github_url),
      'featured'          => filter_var($request->featured, FILTER_VALIDATE_BOOLEAN),
    'tags'              => $request->filled('tags')
                            ? array_map('trim', explode(',', $request->tags))
                            : [],
];
        if ($request->hasFile('image')) {
            $uploaded = Cloudinary::upload($request->file('image')->getRealPath(), [
                'folder' => 'portfolio/projects',
            ]);
            $data['image'] = $uploaded->getSecurePath();
        }

        $project = Project::create($data);
        return response()->json([
            'success' => true,
            'message' => 'Project created successfully!',
            'data'    => $project,
        ], 201);
    }

    public function update(Request $request, Project $project)
    {
        $request->validate([
            'title'       => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:3072',
            'demo_url'    => 'nullable|string|max:255',
            'github_url'  => 'nullable|string|max:255',
            'tags'        => 'nullable|string',
            'featured'    => 'nullable',
        ]);

        $data = [
            'title'       => $request->title ?? $project->title,
            'description' => $request->has('description') ? ($request->description ?: null) : $project->description,
            'short_description' => $request->has('short_description') ? $request->short_description : $project->short_description,
            'demo_url'    => $request->has('demo_url') ? $this->cleanUrl($request->demo_url) : $project->demo_url,
            'github_url'  => $request->has('github_url') ? $this->cleanUrl($request->github_url) : $project->github_url,
            'featured'    => $request->has('featured')
                                ? filter_var($request->featured, FILTER_VALIDATE_BOOLEAN)
                                : $project->featured,
            'tags'        => $request->has('tags')
                                ? ($request->filled('tags') ? array_map('trim', explode(',', $request->tags)) : [])
                                : $project->tags,
        ];

        if ($request->hasFile('image')) {
            $uploaded = Cloudinary::upload($request->file('image')->getRealPath(), [
                'folder' => 'portfolio/projects',
            ]);
            $data['image'] = $uploaded->getSecurePath();
        }

        $project->update($data);
        return response()->json([
            'success' => true,
            'message' => 'Project updated successfully!',
            'data'    => $project->fresh(),
        ]);
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return response()->json(['success' => true, 'message' => 'Project deleted']);
    }

    private function cleanUrl($value): ?string
    {
        if (empty($value) || $value === 'null') return null;
        $value = trim($value);
        if (!$value) return null;
        if (!preg_match('/^https?:\/\//i', $value)) {
            $value = 'https://' . $value;
        }
        return $value;
    }
}
