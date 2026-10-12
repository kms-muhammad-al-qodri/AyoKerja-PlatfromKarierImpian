<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CvAnalysis extends Model
{
    protected $fillable = [
        'user_id',
        'cv_profile_id',
        'overall_score',
        'content_score',
        'structure_score',
        'skills_score',
        'experience_score',
        'impact_score',
        'strengths',
        'opportunities',
        'ai_summary',
    ];

    protected $casts = [
        'strengths' => 'array',
        'opportunities' => 'array',
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
