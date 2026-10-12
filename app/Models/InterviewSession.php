<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InterviewSession extends Model
{
    protected $fillable = [
        'user_id',
        'target_role',
        'difficulty',
        'question',
        'user_answer',
        'technical_score',
        'communication_score',
        'relevance_score',
        'overall_score',
        'feedback',
    ];

    protected $casts = [
        'feedback' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
