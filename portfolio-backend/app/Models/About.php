<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class About extends Model {
    use HasFactory;

    protected $fillable = [
        'name',
        'title',
        'subtitle',
        'description',
        'email',
        'phone',
        'location',
        'available',
        'profile_image',
        'cv_file',
        'github_url',
        'linkedin_url',
        'twitter_url',
    ];
}