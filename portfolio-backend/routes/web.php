<?php
use Illuminate\Support\Facades\Route;
use App\Models\Skill;

Route::get('/', function () {
    return response()->json(['status' => 'Portfolio API running ✅']);
});

// Quick debug route — visit http://localhost:8000/debug/skills in browser
Route::get('/debug/skills', function () {
    return response()->json([
        'count'  => Skill::count(),
        'skills' => Skill::orderBy('sort_order')->get(),
    ]);
});

// Debug — visit http://localhost:8000/debug/projects-table
Route::get('/debug/projects-table', function () {
    $columns = \Illuminate\Support\Facades\Schema::getColumnListing('projects');
    $count   = \App\Models\Project::count();
    $sample  = \App\Models\Project::first();
    return response()->json([
        'table_columns' => $columns,
        'count'         => $count,
        'sample'        => $sample,
    ]);
});

// Debug — visit http://localhost:8000/debug/about-table
Route::get('/debug/about-table', function () {
    $columns = \Illuminate\Support\Facades\Schema::getColumnListing('abouts');
    $data    = \App\Models\About::first();
    return response()->json([
        'table_columns' => $columns,
        'current_data'  => $data,
    ]);

});
// Debug — visit http://localhost:8000/debug/contacts-table
Route::get('/debug/contacts-table', function () {
    $columns = \Illuminate\Support\Facades\Schema::getColumnListing('contacts');
    $data    = \App\Models\Contact::all();
    return response()->json([
        'table_columns' => $columns,
        'count'         => $data->count(),
        'sample'        => $data->first(),
    ]);
});
