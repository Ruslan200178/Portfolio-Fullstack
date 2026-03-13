<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Education;
use Illuminate\Http\Request;

class EducationController extends Controller
{
    public function index()
    {
        $items = Education::orderBy('sort_order')->orderBy('start_date', 'desc')->get();
        return response()->json(['success' => true, 'data' => $items]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'institution'    => 'required|string|max:255',
            'degree'         => 'required|string|max:255',
            'field_of_study' => 'nullable|string|max:255',
            'start_date'     => 'required|string',        // NOT NULL in your table
            'end_date'       => 'nullable|string',
            'is_current'     => 'nullable|boolean',
            'grade'          => 'nullable|string|max:255',
            'description'    => 'nullable|string',
        ]);

        $data = [
            'institution'    => $request->institution,
            'degree'         => $request->degree,
            'field_of_study' => $request->field_of_study ?? $request->field ?? null,
            'start_date'     => $this->parseDate($request->start_date),
            'end_date'       => $this->parseDate($request->end_date),
            'is_current'     => $request->boolean('is_current', false),
            'grade'          => $request->grade ?? null,
            'description'    => $request->description ?? null,
        ];

        $item = Education::create($data);
        return response()->json(['success' => true, 'message' => 'Education added!', 'data' => $item], 201);
    }

    public function update(Request $request, Education $education)
    {
        $request->validate([
            'institution'    => 'sometimes|required|string|max:255',
            'degree'         => 'sometimes|required|string|max:255',
            'field_of_study' => 'nullable|string|max:255',
            'start_date'     => 'nullable|string',
            'end_date'       => 'nullable|string',
            'is_current'     => 'nullable|boolean',
            'grade'          => 'nullable|string|max:255',
            'description'    => 'nullable|string',
        ]);

        $data = [
            'institution'    => $request->institution    ?? $education->institution,
            'degree'         => $request->degree         ?? $education->degree,
            'field_of_study' => $request->field_of_study ?? $request->field ?? $education->field_of_study,
            'start_date'     => $this->parseDate($request->start_date) ?? $education->start_date,
            'end_date'       => $this->parseDate($request->end_date),
            'is_current'     => $request->has('is_current') ? $request->boolean('is_current') : $education->is_current,
            'grade'          => $request->grade       ?? $education->grade,
            'description'    => $request->description ?? $education->description,
        ];

        $education->update($data);
        return response()->json(['success' => true, 'message' => 'Education updated!', 'data' => $education->fresh()]);
    }

    public function destroy(Education $education)
    {
        $education->delete();
        return response()->json(['success' => true, 'message' => 'Education deleted']);
    }

    private function parseDate($value): ?string
    {
        if (empty($value) || in_array($value, ['null', 'undefined', 'false', '0000-00-00'])) {
            return null;
        }
        try {
            return \Carbon\Carbon::parse($value)->toDateString();
        } catch (\Exception $e) {
            return null;
        }
    }
}