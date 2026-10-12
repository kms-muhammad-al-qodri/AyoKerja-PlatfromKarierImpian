<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'onboarding_completed',
        'avatar',
        'google_id',
        'education',
        'current_status',
        'experience_level',
        'interested_field',
        'target_role',
        'skills_list',
        'career_goal',
        'work_mode',
        'location',
        'language',  // 🌐 preferensi bahasa platform (id/en)
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function cvProfiles(): HasMany
    {
        return $this->hasMany(CvProfile::class);
    }

    public function latestCvProfile(): HasOne
    {
        return $this->hasOne(CvProfile::class)->latestOfMany();
    }

    public function cvAnalyses(): HasMany
    {
        return $this->hasMany(CvAnalysis::class);
    }

    public function jobMatches(): HasMany
    {
        return $this->hasMany(JobMatch::class);
    }

    public function skillGap(): HasOne
    {
        return $this->hasOne(SkillGap::class)->latestOfMany();
    }

    public function careerRoadmap(): HasOne
    {
        return $this->hasOne(CareerRoadmap::class)->latestOfMany();
    }

    public function generatedCvs(): HasMany
    {
        return $this->hasMany(GeneratedCv::class);
    }

    public function interviewSessions(): HasMany
    {
        return $this->hasMany(InterviewSession::class);
    }
}
