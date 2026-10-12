<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobMatch extends Model
{
    protected $fillable = [
        'user_id',
        'job_posting_id',
        'match_percentage',
        'technical_skills_score',
        'experience_score',
        'education_score',
        'career_interest_score',
        'matched_skills',
        'missing_skills',
        'ai_explanation',
    ];

    protected $casts = [
        'matched_skills' => 'array',
        'missing_skills' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function jobPosting(): BelongsTo
    {
        return $this->belongsTo(JobPosting::class);
    }
}
