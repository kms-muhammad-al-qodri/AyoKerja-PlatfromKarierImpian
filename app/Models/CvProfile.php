<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class CvProfile extends Model
{
    protected $fillable = [
        'user_id',
        'original_filename',
        'file_path',
        'file_size',
        'parsed_text',
        'raw_skills',
        'experience_summary',
        'education_history',
        'career_confidence',
        'detected_role',
        'status',
    ];

    protected $casts = [
        'raw_skills' => 'array',
        'education_history' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function cvAnalysis(): HasOne
    {
        return $this->hasOne(CvAnalysis::class);
    }
}
