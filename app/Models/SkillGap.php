<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SkillGap extends Model
{
    protected $fillable = [
        'user_id',
        'target_role',
        'current_capabilities',
        'high_priority',
        'medium_priority',
        'low_priority',
    ];

    protected $casts = [
        'current_capabilities' => 'array',
        'high_priority' => 'array',
        'medium_priority' => 'array',
        'low_priority' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
