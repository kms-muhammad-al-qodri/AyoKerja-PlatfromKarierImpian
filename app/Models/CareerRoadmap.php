<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CareerRoadmap extends Model
{
    protected $fillable = [
        'user_id',
        'target_role',
        'nodes',
    ];

    protected $casts = [
        'nodes' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
