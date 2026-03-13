<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function index()
    {
        $skills = Skill::orderBy('sort_order')->orderBy('created_at', 'desc')->get();
        return response()->json(['success' => true, 'data' => $skills]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'       => 'required|string|max:255',
            'percentage' => 'required|integer|min:1|max:100',
            'category'   => 'nullable|string|max:255',
            'icon'       => 'nullable|string|max:20',
            'color'      => 'nullable|string|max:50',
        ]);

        $skill = Skill::create([
            'name'       => $request->name,
            'percentage' => (int) $request->percentage,
            'category'   => $request->category  ?: null,
            'icon'       => $request->icon       ?: null,
            'color'      => $request->color      ?: null,
            'sort_order' => Skill::max('sort_order') + 1,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Skill created successfully',
            'data'    => $skill,
        ], 201);
    }

    public function update(Request $request, Skill $skill)
    {
        $request->validate([
            'name'       => 'sometimes|required|string|max:255',
            'percentage' => 'sometimes|required|integer|min:1|max:100',
            'category'   => 'nullable|string|max:255',
            'icon'       => 'nullable|string|max:20',
            'color'      => 'nullable|string|max:50',
        ]);

        $skill->update([
            'name'       => $request->name       ?? $skill->name,
            'percentage' => $request->has('percentage') ? (int) $request->percentage : $skill->percentage,
            'category'   => $request->has('category') ? ($request->category ?: null) : $skill->category,
            'icon'       => $request->has('icon')     ? ($request->icon     ?: null) : $skill->icon,
            'color'      => $request->has('color')    ? ($request->color    ?: null) : $skill->color,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Skill updated',
            'data'    => $skill->fresh(),
        ]);
    }

    public function destroy(Skill $skill)
    {
        $skill->delete();
        return response()->json(['success' => true, 'message' => 'Skill deleted']);
    }
}
