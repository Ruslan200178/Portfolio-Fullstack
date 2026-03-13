<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ExperienceController extends Controller
{
    use ApiResponseTrait;

    // ─────────────────────────────────────────
    // GET All Experiences (Public)
    // ─────────────────────────────────────────
    public function index()
    {
        $experiences = Experience::ordered()->get();

        return $this->successResponse($experiences, 'Experiences retrieved successfully');
    }

    // ─────────────────────────────────────────
    // GET Single Experience (Public)
    // ─────────────────────────────────────────
    public function show($id)
    {
        $experience = Experience::find($id);

        if (!$experience) {
            return $this->notFoundResponse('Experience not found');
        }

        return $this->successResponse($experience, 'Experience retrieved successfully');
    }

    // ─────────────────────────────────────────
    // CREATE Experience (Admin)
    // ─────────────────────────────────────────
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'company'      => 'required|string|max:255',
            'position'     => 'required|string|max:255',
            'location'     => 'nullable|string|max:255',
            'start_date'   => 'required|date',
            'end_date'     => 'nullable|date|after:start_date',
            'is_current'   => 'nullable|boolean',
            'description'  => 'required|string',
            'company_logo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:1024',
            'sort_order'   => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        $data = $request->only([
            'company', 'position', 'location',
            'start_date', 'end_date', 'is_current',
            'description', 'sort_order',
        ]);

        // If is_current true, clear end_date
        if ($request->is_current) {
            $data['end_date'] = null;
        }

        // Handle logo upload
        if ($request->hasFile('company_logo')) {
            $data['company_logo'] = $request->file('company_logo')
                ->store('experiences', 'public');
        }

        $data['sort_order'] = $request->sort_order ?? 0;

        $experience = Experience::create($data);

        return $this->successResponse($experience, 'Experience created successfully', 201);
    }

    // ─────────────────────────────────────────
    // UPDATE Experience (Admin)
    // ─────────────────────────────────────────
    public function update(Request $request, $id)
    {
        $experience = Experience::find($id);

        if (!$experience) {
            return $this->notFoundResponse('Experience not found');
        }

        $validator = Validator::make($request->all(), [
            'company'      => 'required|string|max:255',
            'position'     => 'required|string|max:255',
            'location'     => 'nullable|string|max:255',
            'start_date'   => 'required|date',
            'end_date'     => 'nullable|date|after:start_date',
            'is_current'   => 'nullable|boolean',
            'description'  => 'required|string',
            'company_logo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:1024',
            'sort_order'   => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        $data = $request->only([
            'company', 'position', 'location',
            'start_date', 'end_date', 'is_current',
            'description', 'sort_order',
        ]);

        // If is_current true, clear end_date
        if ($request->is_current) {
            $data['end_date'] = null;
        }

        // Handle logo upload
        if ($request->hasFile('company_logo')) {
            if ($experience->company_logo) {
                Storage::disk('public')->delete($experience->company_logo);
            }
            $data['company_logo'] = $request->file('company_logo')
                ->store('experiences', 'public');
        }

        $experience->update($data);

        return $this->successResponse($experience, 'Experience updated successfully');
    }

    // ─────────────────────────────────────────
    // DELETE Experience (Admin)
    // ─────────────────────────────────────────
    public function destroy($id)
    {
        $experience = Experience::find($id);

        if (!$experience) {
            return $this->notFoundResponse('Experience not found');
        }

        if ($experience->company_logo) {
            Storage::disk('public')->delete($experience->company_logo);
        }

        $experience->delete();

        return $this->successResponse(null, 'Experience deleted successfully');
    }
}
