<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;
protected $table = 'projects';
    protected $fillable = [
        'title',
        'short_description',
        'description',
        'image',
        'demo_url',
        'github_url',
        'tags',
        'status',
        'is_featured',
        'sort_order',
    ];

    protected $casts = [
        'tags'        => 'array',   // auto convert JSON to array
        'is_featured' => 'boolean',
        'sort_order'  => 'integer',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        if ($this->image) {
            return asset('storage/' . $this->image);
        }
        return null;
    }

    // Scope featured only
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    // Scope ordered
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order', 'asc');
    }
}