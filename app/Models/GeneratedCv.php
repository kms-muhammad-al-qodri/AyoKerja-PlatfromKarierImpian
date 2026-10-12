<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GeneratedCv extends Model
{
    protected $table = 'generated_cvs';

    protected $fillable = [
        'user_id',
        'cv_profile_id',
        'template_name',
        'full_name',
        'email',
        'phone',
        'location',
        'summary',
        'experiences',
        'education',
        'projects',
        'skills',
        'photo_path',
        'is_ats_optimized',
    ];

    protected $casts = [
        'experiences' => 'array',
        'education' => 'array',
        'projects' => 'array',
        'skills' => 'array',
        'is_ats_optimized' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function cvProfile(): BelongsTo
    {
        return $this->belongsTo(CvProfile::class);
    }
}
