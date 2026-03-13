<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    use HasFactory;
protected $table = 'experiences';
    protected $fillable = [
        'company',
        'position',
        'location',
        'start_date',
        'end_date',
        'is_current',
        'description',
        'company_logo',
        'sort_order',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date'   => 'date',
        'is_current' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected $appends = ['company_logo_url', 'duration'];

    public function getCompanyLogoUrlAttribute()
    {
        if ($this->company_logo) {
            return asset('storage/' . $this->company_logo);
        }
        return null;
    }

    // Auto calculate duration e.g "2 years 3 months"
    public function getDurationAttribute()
    {
        $start = $this->start_date;
        $end   = $this->is_current ? now() : $this->end_date;

        if (!$start || !$end) return null;

        $years  = $start->diffInYears($end);
        $months = $start->copy()->addYears($years)->diffInMonths($end);

        $duration = '';
        if ($years > 0)  $duration .= $years . ' yr' . ($years > 1 ? 's' : '') . ' ';
        if ($months > 0) $duration .= $months . ' mo' . ($months > 1 ? 's' : '');

        return trim($duration) ?: 'Less than a month';
    }

    // Scope ordered
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order', 'asc');
    }
}