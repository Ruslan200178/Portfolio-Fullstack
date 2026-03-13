<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    use HasFactory;

    protected $table = 'educations'; // ← ADD THIS LINE


    protected $fillable = [
        'institution',
        'degree',
        'field_of_study',   // matches your table column name
        'start_date',
        'end_date',
        'is_current',
        'grade',
        'description',
        'institution_logo',
        'sort_order',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date'   => 'date',
        'is_current' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected $appends = ['institution_logo_url'];

    public function getInstitutionLogoUrlAttribute()
    {
        if ($this->institution_logo) {
            return asset('storage/' . $this->institution_logo);
        }
        return null;
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order', 'asc');
    }
}