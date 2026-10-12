<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobPosting extends Model
{
    protected $fillable = [
        'title',
        'company_name',
        'location',
        'work_type',
        'salary_range',
        'required_skills',
        'description',
        'apply_url',
    ];

    protected $casts = [
        'required_skills' => 'array',
    ];

    public function matches(): HasMany
    {
        return $this->hasMany(JobMatch::class);
    }
}
