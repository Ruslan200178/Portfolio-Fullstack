<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;
protected $table = 'skills';
    protected $fillable = [
        'name',
        'percentage',
        'category',
        'icon',
        'color',
        'sort_order',
    ];

    protected $casts = [
        'percentage'  => 'integer',
        'sort_order'  => 'integer',
    ];

    // Scope to get by category
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    // Scope ordered
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order', 'asc');
    }
}