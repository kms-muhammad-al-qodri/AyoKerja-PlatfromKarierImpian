<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\JobPosting;
use App\Models\CvProfile;
use App\Models\JobMatch;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Admin User
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin Rafatech',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'onboarding_completed' => true,
                'target_role' => 'Administrator',
                'skills_list' => 'Management, System Admin, Laravel',
            ]
        );

        // 2. Create Regular Demo User
        $user = User::firstOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'Budi Pratama',
                'password' => Hash::make('password'),
                'role' => 'user',
                'onboarding_completed' => true,
                'education' => 'S1 Teknik Informatika',
                'current_status' => 'Fresh Graduate',
                'experience_level' => 'Junior (0-2 tahun)',
                'interested_field' => 'Software Development',
                'target_role' => 'Fullstack Web Developer',
                'skills_list' => 'PHP, Laravel, JavaScript, React.js, TailwindCSS, MySQL, Git',
                'career_goal' => 'Menjadi Senior Fullstack Developer dalam 3 tahun',
            ]
        );

        // 3. Create Sample CV Profile for user
        $cvProfile = CvProfile::updateOrCreate(
            ['user_id' => $user->id, 'original_filename' => 'CV_Budi_Pratama.pdf'],
            [
                'file_path' => 'cv_profiles/sample_cv.pdf',
                'file_size' => 1024500,
                'parsed_text' => 'Budi Pratama - Fullstack Developer dengan keahlian PHP, Laravel, React.js, TailwindCSS.',
                'raw_skills' => ['PHP', 'Laravel', 'JavaScript', 'React.js', 'TailwindCSS', 'MySQL', 'Git'],
                'experience_summary' => 'Junior Web Developer di PT Solusi Web (1 tahun)',
                'education_history' => [['degree' => 'S1 Teknik Informatika', 'institution' => 'Universitas Indonesia', 'year' => '2025']],
                'career_confidence' => 88,
                'detected_role' => 'Fullstack Developer',
                'status' => 'completed',
            ]
        );
    }
}
