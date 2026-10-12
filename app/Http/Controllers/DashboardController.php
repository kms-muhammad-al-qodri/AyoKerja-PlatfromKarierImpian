<?php

namespace App\Http\Controllers;

use App\Models\CvProfile;
use App\Models\CvAnalysis;
use App\Models\CareerRoadmap;
use App\Services\AiCareerService;
use App\Services\CvParserService;
use App\Services\JobFetcherService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Throwable;

class DashboardController extends Controller
{
    protected JobFetcherService $jobFetcher;
    protected AiCareerService $aiService;

    public function __construct(JobFetcherService $jobFetcher, AiCareerService $aiService)
    {
        $this->jobFetcher = $jobFetcher;
        $this->aiService = $aiService;
    }

    /**
     * Compute Dynamic Real-Time User Metrics & Multi-CV Stats.
     */
    private function computeUserStats($user, array $liveJobs): array
    {
        $targetRole = $user?->target_role ?? 'Backend Developer';
        
        // Extract user skills array
        $userSkills = [];
        if (!empty($user?->skills_list)) {
            $userSkills = array_values(array_filter(array_map('trim', explode(',', $user->skills_list))));
        }

        // Fetch all CV profiles for user
        $userCvs = CvProfile::where('user_id', $user?->id)->with('cvAnalysis')->latest()->get();
        $activeCvId = session('active_cv_id');
        $activeCv = $userCvs->where('id', $activeCvId)->first() ?? $userCvs->first();
        $hasCv = !empty($activeCv);

        if ($hasCv && !empty($activeCv->raw_skills) && is_array($activeCv->raw_skills)) {
            $userSkills = array_values(array_unique(array_merge($userSkills, array_filter(array_map('trim', $activeCv->raw_skills)))));
        }

        // Formatted CV collection
        $userCvsFormatted = $userCvs->map(function($cv) use ($activeCv) {
            $analysis = $cv->cvAnalysis;
            return [
                'id' => $cv->id,
                'filename' => $cv->original_filename,
                'file_size' => $cv->file_size ? round($cv->file_size / 1024) . ' KB' : '1 MB',
                'ats_score' => $analysis?->overall_score ?? $cv->career_confidence ?? 85,
                'detected_role' => $cv->detected_role ?? 'Backend Developer',
                'status' => $cv->status,
                'created_at' => $cv->created_at ? $cv->created_at->format('d M Y, H:i') : 'Baru saja',
                'is_active' => $activeCv && $cv->id === $activeCv->id,
            ];
        })->values()->toArray();

        // 1. Calculate CV ATS Score dynamically
        if ($activeCv) {
            $cvAnalysis = $activeCv->cvAnalysis;
            $cvScore = $cvAnalysis?->overall_score ?? $activeCv->career_confidence ?? 85;
        } else {
            $cvScore = null;
        }

        // 2. Calculate Career Match % dynamically
        if (!empty($userSkills) && count($liveJobs) > 0) {
            $firstJobSkills = $liveJobs[0]['matched_skills'] ?? ['Laravel', 'PHP', 'MySQL'];
            $matchResult = $this->aiService->calculateJobMatch($userSkills, $firstJobSkills, $targetRole);
            $careerMatch = $matchResult['match_percentage'] ?? 85;
        } elseif (!empty($userSkills)) {
            $careerMatch = 75;
        } else {
            $careerMatch = 0;
        }

        // 3. Calculate Skill Progress % dynamically
        $coreSkillRequirements = [
            'Backend Developer' => ['PHP', 'Laravel', 'MySQL', 'REST API', 'Git', 'Docker'],
            'Frontend Developer' => ['JavaScript', 'React', 'Tailwind', 'HTML/CSS', 'TypeScript', 'Git'],
            'Full Stack Developer' => ['PHP', 'Laravel', 'React', 'MySQL', 'Node.js', 'Git'],
            'Mobile App Developer' => ['Flutter', 'Dart', 'React Native', 'REST API', 'Firebase', 'Git'],
            'UI/UX Designer' => ['Figma', 'Prototyping', 'User Research', 'Wireframing', 'Design System'],
            'AI / Data Engineer' => ['Python', 'SQL', 'Pandas', 'TensorFlow', 'Scikit-Learn', 'Git'],
            'DevOps Engineer' => ['Docker', 'Kubernetes', 'Linux', 'CI/CD', 'AWS', 'Bash'],
            'HRD / Recruiter' => ['ATS Management', 'Screening', 'Talent Acquisition', 'Interviewing'],
        ];

        $targetSkillList = $coreSkillRequirements[$targetRole] ?? ['PHP', 'Laravel', 'MySQL', 'REST API', 'Git'];
        $matchedCount = 0;
        if (!empty($userSkills)) {
            $lowerUserSkills = array_map('strtolower', $userSkills);
            foreach ($targetSkillList as $sk) {
                if (in_array(strtolower($sk), $lowerUserSkills)) {
                    $matchedCount++;
                }
            }
        }

        $skillProgress = (!empty($userSkills) && count($targetSkillList) > 0)
            ? (int) round(($matchedCount / count($targetSkillList)) * 100)
            : 0;

        $activeCvAnalysis = null;
        if ($activeCv && $activeCv->cvAnalysis) {
            $a = $activeCv->cvAnalysis;
            $activeCvAnalysis = [
                'overall_score' => $a->overall_score,
                'content_score' => $a->content_score,
                'structure_score' => $a->structure_score,
                'skills_score' => $a->skills_score,
                'experience_score' => $a->experience_score,
                'impact_score' => $a->impact_score,
                'strengths' => $a->strengths ?? [],
                'opportunities' => $a->opportunities ?? [],
                'ai_summary' => $a->ai_summary ?? '',
            ];
        }

        // Profile completeness & signup score estimation
        $profileFieldsCount = 0;
        if (!empty($user?->name)) $profileFieldsCount++;
        if (!empty($user?->education) && $user->education !== 'Belum diisi') $profileFieldsCount++;
        if (!empty($user?->experience_level)) $profileFieldsCount++;
        if (!empty($user?->location)) $profileFieldsCount++;
        if (!empty($user?->work_mode)) $profileFieldsCount++;
        if (!empty($user?->career_goal)) $profileFieldsCount++;
        $profileCompleteness = round(($profileFieldsCount / 6) * 100);

        $levelBase = match(strtolower($user?->experience_level ?? '')) {
            'senior', 'expert' => 78,
            'middle', 'intermediate' => 70,
            'fresh graduate', 'fresh graduate / entry level' => 58,
            default => 64,
        };

        $skillMatchScore = count($targetSkillList) > 0 
            ? round(($matchedCount / count($targetSkillList)) * 100) 
            : 60;

        $registrationScore = min(82, max(52, round(($levelBase * 0.4) + ($skillMatchScore * 0.4) + ($profileCompleteness * 0.2))));

        // 4. Trajectory Data (Real-time human stages)
        $trajectory = [];
        if ($hasCv && $activeCvAnalysis) {
            $trajectory = [
                [
                    'month' => 'Format Dokumen',
                    'month_en' => 'Doc Structure',
                    'ats' => (int) ($activeCvAnalysis['structure_score'] ?? 85),
                    'match' => (int) max(45, $careerMatch - 15),
                    'note' => 'Tata letak dan kompatibilitas section CV terhadap bot parsing ATS.',
                    'note_en' => 'Layout and section compatibility with ATS parsing engines.',
                    'is_current' => false,
                ],
                [
                    'month' => 'Kata Kunci Konten',
                    'month_en' => 'Keywords',
                    'ats' => (int) ($activeCvAnalysis['content_score'] ?? 82),
                    'match' => (int) max(55, $careerMatch - 8),
                    'note' => 'Kepadatan dan relevansi kata kunci spesialisasi ' . $targetRole . '.',
                    'note_en' => 'Density and relevance of specialization keywords for ' . $targetRole . '.',
                    'is_current' => false,
                ],
                [
                    'month' => 'Relevansi Pengalaman',
                    'month_en' => 'Experience',
                    'ats' => (int) ($activeCvAnalysis['experience_score'] ?? 80),
                    'match' => (int) $careerMatch,
                    'note' => 'Kesesuaian riwayat proyek dan pencapaian kerja dengan standar HRD.',
                    'note_en' => 'Alignment of project history and accomplishments with HR standards.',
                    'is_current' => false,
                ],
                [
                    'month' => 'CV Aktif Terverifikasi',
                    'month_en' => 'Active Verified CV',
                    'ats' => (int) $cvScore,
                    'match' => (int) $careerMatch,
                    'note' => 'Skor resmi hasil analisis dokumen CV aktif (' . ($activeCv->original_filename ?? 'CV') . ').',
                    'note_en' => 'Official score from active CV analysis (' . ($activeCv->original_filename ?? 'CV') . ').',
                    'is_current' => true,
                ],
                [
                    'month' => 'Target Panggilan HR',
                    'month_en' => 'HR Callback Target',
                    'ats' => (int) min(99, round($cvScore * 1.08)),
                    'match' => (int) min(99, round($careerMatch * 1.06)),
                    'note' => 'Proyeksi peluang maksimal wawancara setelah optimasi AI.',
                    'note_en' => 'Projected peak interview probability after AI optimization.',
                    'is_current' => false,
                ],
            ];
        } else {
            $trajectory = [
                [
                    'month' => 'Biodata Akun',
                    'month_en' => 'Account Bio',
                    'ats' => (int) max(40, $profileCompleteness),
                    'match' => (int) max(40, $levelBase - 15),
                    'note' => 'Kelengkapan profil biodata akun dari formulir pendaftaran.',
                    'note_en' => 'Account bio completeness from signup registration form.',
                    'is_current' => false,
                ],
                [
                    'month' => 'Kesesuaian Skill Registrasi',
                    'month_en' => 'Registered Skill',
                    'ats' => (int) max(48, $skillMatchScore),
                    'match' => (int) max(50, $skillMatchScore),
                    'note' => $matchedCount . ' dari ' . count($targetSkillList) . ' skill target terpenuhi saat pendaftaran.',
                    'note_en' => $matchedCount . ' of ' . count($targetSkillList) . ' target skills met at registration.',
                    'is_current' => false,
                ],
                [
                    'month' => 'Standar Pasar Lowongan',
                    'month_en' => 'Market Match',
                    'ats' => (int) max(55, $careerMatch - 6),
                    'match' => (int) max(58, $careerMatch),
                    'note' => 'Kesesuaian kualifikasi profil dengan data lowongan kerja live.',
                    'note_en' => 'Profile qualification alignment with current live jobs.',
                    'is_current' => false,
                ],
                [
                    'month' => 'Skor Profil Pendaftaran',
                    'month_en' => 'Signup Score (Live)',
                    'ats' => (int) $registrationScore,
                    'match' => (int) $careerMatch,
                    'note' => 'Skor dihitung real-time dari data pendaftaran Anda. Upload CV untuk membuka analisis 90%+!',
                    'note_en' => 'Calculated real-time from your signup data. Upload CV to unlock 90%+ analysis!',
                    'is_current' => true,
                ],
                [
                    'month' => 'Target Lolos ATS',
                    'month_en' => 'ATS Target',
                    'ats' => (int) min(96, $registrationScore + 18),
                    'match' => (int) min(98, $careerMatch + 15),
                    'note' => 'Proyeksi skor melonjak tinggi setelah mengunggah file CV terverifikasi ATS.',
                    'note_en' => 'Projected score jump after uploading an ATS verified CV file.',
                    'is_current' => false,
                ],
            ];
        }

        // 5. Skills Analysis (Real-time Skill Breakdown from User Skills + Job Market)
        $allConsideredSkills = array_values(array_unique(array_merge(
            array_slice($userSkills, 0, 4),
            array_slice($targetSkillList, 0, 4)
        )));

        $skillsAnalysis = [];
        $lowerUserSkills = array_map('strtolower', $userSkills);
        $lowerCvSkills = ($hasCv && !empty($activeCv->raw_skills) && is_array($activeCv->raw_skills)) 
            ? array_map('strtolower', $activeCv->raw_skills) 
            : [];

        $liveJobsCount = max(1, count($liveJobs));

        foreach ($allConsideredSkills as $idx => $skName) {
            $lowerSk = strtolower($skName);
            $inCv = in_array($lowerSk, $lowerCvSkills);
            $inUser = in_array($lowerSk, $lowerUserSkills);

            $demandMatches = 0;
            foreach ($liveJobs as $job) {
                $jobMatched = array_map('strtolower', $job['matched_skills'] ?? []);
                $jobDesc = strtolower($job['description'] ?? '');
                if (in_array($lowerSk, $jobMatched) || str_contains($jobDesc, $lowerSk)) {
                    $demandMatches++;
                }
            }
            $demandPct = round(($demandMatches / $liveJobsCount) * 100);

            if ($inCv) {
                $score = min(96, max(78, ($activeCvAnalysis['skills_score'] ?? 88) + ($demandPct > 30 ? 4 : -2)));
                $status = 'Terverifikasi di CV • Siap Industri';
                $statusEn = 'CV Verified • Industry Ready';
            } elseif ($inUser) {
                $score = min(88, max(68, $levelBase + ($demandPct > 30 ? 5 : 0)));
                $status = 'Profil Pendaftaran Aktif';
                $statusEn = 'Active Signup Profile';
            } else {
                $score = min(58, max(38, 45 + ($demandPct > 30 ? 8 : 0)));
                $status = 'Gap Kebutuhan Lowongan • Perlu Dipelajari';
                $statusEn = 'Market Skill Gap • Need to Learn';
            }

            $skillsAnalysis[] = [
                'name' => $skName,
                'score' => (int) $score,
                'status' => $status,
                'status_en' => $statusEn,
                'in_cv' => $inCv,
                'in_profile' => $inUser,
                'demand_pct' => (int) $demandPct,
            ];
        }

        // 6. Market Metrics (Real-Time Competitiveness Matrix)
        $currentPrimaryScore = $hasCv ? $cvScore : $registrationScore;
        $hrProbability = $hasCv
            ? min(98, round(($cvScore * 0.45) + ($careerMatch * 0.4) + ($skillProgress * 0.15)))
            : min(85, round(($registrationScore * 0.45) + ($careerMatch * 0.35) + ($skillProgress * 0.2)));

        $hrBadge = $hrProbability >= 80 ? 'Peluang Sangat Tinggi' : ($hrProbability >= 65 ? 'Kompetitif' : 'Perlu Optimasi');
        $hrBadgeEn = $hrProbability >= 80 ? 'Very High Odds' : ($hrProbability >= 65 ? 'Competitive' : 'Needs Optimization');

        $marketMetrics = [
            [
                'title' => 'Kesesuaian ATS Real-Time',
                'title_en' => 'Real-Time ATS Alignment',
                'score' => (int) $currentPrimaryScore,
                'target' => 80,
                'badge' => $hasCv 
                    ? ($currentPrimaryScore >= 80 ? 'Sangat Optimal' : 'Perlu Tingkatkan') 
                    : 'Profil Pendaftaran',
                'badge_en' => $hasCv 
                    ? ($currentPrimaryScore >= 80 ? 'Highly Optimal' : 'Needs Boost') 
                    : 'Signup Profile',
                'detail' => 'Kesesuaian profil untuk ' . $targetRole,
                'detail_en' => 'Profile match for ' . $targetRole,
                'color' => 'text-teal-400',
            ],
            [
                'title' => 'Penguasaan Skill Target',
                'title_en' => 'Target Skill Mastery',
                'score' => (int) $skillProgress,
                'target' => 75,
                'badge' => $matchedCount . '/' . count($targetSkillList) . ' Skill Terpenuhi',
                'badge_en' => $matchedCount . '/' . count($targetSkillList) . ' Skills Met',
                'detail' => 'Kesesuaian dengan kualifikasi pasar lowongan',
                'detail_en' => 'Match with live job market requirements',
                'color' => 'text-indigo-400',
            ],
            [
                'title' => 'Peluang Panggilan HR',
                'title_en' => 'HR Callback Odds',
                'score' => (int) $hrProbability,
                'target' => 70,
                'badge' => $hrBadge,
                'badge_en' => $hrBadgeEn,
                'detail' => 'Proyeksi AI dari kelengkapan profil & skill',
                'detail_en' => 'AI projection from profile & skill completeness',
                'color' => 'text-cyan-400',
            ],
            [
                'title' => 'Lowongan Live Terdeteksi',
                'title_en' => 'Live Jobs Detected',
                'score' => (int) count($liveJobs),
                'target' => 10,
                'is_count' => true,
                'badge' => 'Adzuna API Real-Time',
                'badge_en' => 'Adzuna API Real-Time',
                'detail' => 'Total rekomendasi aktif yang cocok',
                'detail_en' => 'Total matching active recommendations',
                'color' => 'text-emerald-400',
            ],
        ];

        return [
            'cvScore' => $cvScore,
            'careerMatch' => $careerMatch,
            'skillProgress' => $skillProgress,
            'recommendedJobs' => count($liveJobs),
            'matchedSkillsCount' => $matchedCount,
            'totalRequiredSkills' => count($targetSkillList),
            'userSkills' => !empty($userSkills) ? $userSkills : [],
            'targetSkills' => $targetSkillList,
            'registrationScore' => $registrationScore,
            'trajectory' => $trajectory,
            'skillsAnalysis' => $skillsAnalysis,
            'marketMetrics' => $marketMetrics,
            'hasCv' => $hasCv,
            'userCvs' => $userCvsFormatted,
            'activeCv' => $activeCv ? [
                'id' => $activeCv->id,
                'filename' => $activeCv->original_filename ?? 'CV_Profil.pdf',
                'ats_score' => $activeCv->cvAnalysis?->overall_score ?? $activeCv->career_confidence ?? 85,
                'detected_role' => $activeCv->detected_role ?? $targetRole,
                'created_at' => $activeCv->created_at?->diffForHumans() ?? 'Baru saja',
            ] : null,
            'activeCvAnalysis' => $activeCvAnalysis,
            'savedRoadmap' => $user ? (function() use ($user) {
                $rm = CareerRoadmap::where('user_id', $user->id)->first();
                return $rm ? [
                    'target_role' => $rm->target_role,
                    'nodes' => $rm->nodes,
                    'updated_at' => $rm->updated_at?->diffForHumans(),
                ] : null;
            })() : null,
            'isOnboarded' => (bool) ($user?->onboarding_completed ?? false),
        ];
    }

    /**
     * Render Main Dashboard View with Dynamic Live Data & Multi-CV support.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $targetRole = $user?->target_role ?? 'Backend Developer';

        $userSkillsStr = $user?->skills_list ?? '';
        $userSkills = !empty($userSkillsStr) ? array_map('trim', explode(',', $userSkillsStr)) : [];
        $userLocation = !empty($user?->location) ? $user->location : 'Indonesia';

        // Fetch live jobs from Adzuna & Jooble APIs matching real user profile & registered location
        $liveJobs = $this->jobFetcher->fetchRealJobs($targetRole, $userSkills, $userLocation);

        // Compute Dynamic Real-Time Stats
        $stats = $this->computeUserStats($user, $liveJobs);

        // Generate AI Insight tailored to user
        $userName = $user?->name ?? 'Pengguna';
        $userLevel = $user?->experience_level ?? 'Junior';
        $jobCount = count($liveJobs);
        $userSkillsStr = !empty($user?->skills_list) ? $user->skills_list : 'PHP & Laravel';

        $aiInsight = "Halo {$userName}! Profil {$userLevel} Anda difokuskan pada {$targetRole} dengan keahlian utama ({$userSkillsStr}). Live API Adzuna & Jooble mendeteksi {$jobCount} lowongan kerja real-time yang sangat cocok untuk profil Anda hari ini.";

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'jobs' => $liveJobs,
                'user' => [
                    'id' => $user?->id,
                    'name' => $userName,
                    'email' => $user?->email,
                    'role' => $targetRole,
                    'level' => $userLevel,
                    'education' => $user?->education ?? 'Belum diisi',
                    'location' => $user?->location ?? '',
                    'work_mode' => $user?->work_mode ?? '',
                    'onboarding_completed' => (bool) ($user?->onboarding_completed ?? false),
                ],
                'stats' => $stats,
                'timestamp' => now()->format('H:i:s T'),
            ]);
        }

        return Inertia::render('Dashboard', [
            'user' => [
                'id' => $user?->id,
                'name' => $userName,
                'email' => $user?->email,
                'role' => $targetRole,
                'level' => $userLevel,
                'education' => $user?->education ?? 'Belum diisi',
                'skills_list' => $user?->skills_list ?? '',
                'location' => $user?->location ?? '',
                'work_mode' => $user?->work_mode ?? '',
                'onboarding_completed' => (bool) ($user?->onboarding_completed ?? false),
            ],
            'stats' => $stats,
            'userCvs' => $stats['userCvs'],
            'careerProfile' => [
                'role' => $targetRole,
                'level' => $userLevel,
                'skills' => $stats['userSkills'],
                'targetSkills' => $stats['targetSkills'],
                'aiInsight' => $aiInsight,
            ],
            'jobs' => $liveJobs,
            'initialTab' => $request->query('tab', 'overview'),
        ]);
    }

    /**
     * Set selected CV as active for session & matching.
     */
    public function selectCv($id)
    {
        $user = Auth::user();
        $cv = CvProfile::where('user_id', $user->id)->findOrFail($id);
        session(['active_cv_id' => $cv->id]);

        return redirect()->back()->with('success', 'CV ' . $cv->original_filename . ' berhasil dijadikan CV Aktif!');
    }

    /**
     * Delete selected CV from collection.
     */
    public function deleteCv($id)
    {
        $user = Auth::user();
        $cv = CvProfile::where('user_id', $user->id)->findOrFail($id);
        
        if ($cv->cvAnalysis) {
            $cv->cvAnalysis->delete();
        }
        $cv->delete();

        if (session('active_cv_id') == $id) {
            session()->forget('active_cv_id');
        }

        return redirect()->back()->with('success', 'CV berhasil dihapus dari koleksi.');
    }

    /**
     * Generate & add sample ATS CV for quick testing in collection.
     */
    public function uploadSampleCv(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->back()->with('error', 'Silakan login terlebih dahulu.');
        }

        $sampleType = $request->input('sample_type', 'backend');

        $sampleData = [
            'backend' => [
                'filename' => 'CV_ATS_Senior_Backend_Developer.pdf',
                'role' => 'Senior Backend Developer',
                'score' => 92,
                'skills' => ['Laravel', 'PHP 8.3', 'MySQL', 'Redis', 'Docker', 'REST API', 'Microservices'],
                'size' => 1024 * 340,
                'parsed' => 'Experienced Senior Backend Developer with 5+ years expertise in Laravel, PHP, RESTful APIs, MySQL database optimization, Redis caching, and Docker containerization.',
            ],
            'frontend' => [
                'filename' => 'CV_ATS_Fullstack_React_Engineer.pdf',
                'role' => 'Fullstack React Engineer',
                'score' => 88,
                'skills' => ['React.js', 'Next.js', 'TypeScript', 'TailwindCSS', 'Node.js', 'GraphQL'],
                'size' => 1024 * 280,
                'parsed' => 'Skilled Fullstack React Engineer specializing in building ultra-fast web applications using Next.js, TypeScript, TailwindCSS, and Node.js backend services.',
            ],
            'data' => [
                'filename' => 'CV_ATS_AI_Data_Scientist.pdf',
                'role' => 'AI & Data Scientist',
                'score' => 95,
                'skills' => ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Machine Learning', 'Pandas', 'NLP'],
                'size' => 1024 * 410,
                'parsed' => 'Data Scientist & AI Specialist with proven record in machine learning models, natural language processing, predictive analytics, and big data visualization.',
            ],
        ];

        $selected = $sampleData[$sampleType] ?? $sampleData['backend'];

        $cvProfile = CvProfile::create([
            'user_id' => $user->id,
            'original_filename' => $selected['filename'],
            'file_path' => 'cvs/sample_' . time() . '.pdf',
            'file_size' => $selected['size'],
            'parsed_text' => $selected['parsed'],
            'raw_skills' => $selected['skills'],
            'career_confidence' => $selected['score'],
            'detected_role' => $selected['role'],
            'status' => 'completed',
        ]);

        CvAnalysis::create([
            'user_id' => $user->id,
            'cv_profile_id' => $cvProfile->id,
            'overall_score' => $selected['score'],
            'content_score' => $selected['score'] - 2,
            'structure_score' => 94,
            'skills_score' => $selected['score'] + 1,
            'experience_score' => 86,
            'impact_score' => 84,
            'strengths' => [
                'Format ATS ramah sistem recruiter dengan struktur section terstandarisasi.',
                'Penggunaan kata kerja aksi (Action Verbs) dan pencapaian kuantitatif di setiap pengalaman kerja.',
                'Keseimbangan yang baik antara Hard Skills (' . implode(', ', array_slice($selected['skills'], 0, 4)) . ') dan Soft Skills leadership.',
            ],
            'opportunities' => [
                'Tambahkan sertifikasi profesional terkini untuk meningkatkan skor industri.',
                'Optimalkan ringkasan profil agar lebih padat.',
            ],
            'ai_summary' => 'CV ini menunjukkan kualifikasi yang sangat solid untuk posisi ' . $selected['role'] . ' dengan kata kunci teknis yang relevan dan skor ATS unggul.',
        ]);

        session(['active_cv_id' => $cvProfile->id]);

        return redirect()->back()->with('success', 'Sample CV "' . $selected['filename'] . '" berhasil ditambahkan & dijadikan CV Aktif!');
    }

    /**
     * API Endpoint for real-time live data refresh on Dashboard.
     */
    public function getLiveData(Request $request)
    {
        $user = Auth::user();
        $targetRole = $request->input('target_role') ?: ($user?->target_role ?? 'Backend Developer');
        $location = $request->input('location') ?: '';
        $country = $request->input('country') ?: 'id';
        $jobType = $request->input('job_type') ?: 'all';
        $page = (int) $request->input('page', 1);

        $userSkillsStr = $user?->skills_list ?? '';
        $userSkills = !empty($userSkillsStr) ? array_map('trim', explode(',', $userSkillsStr)) : [];

        $liveJobs = $this->jobFetcher->fetchRealJobs($targetRole, $userSkills, $location, $country, $jobType, $page, 10);
        $stats = $this->computeUserStats($user, $liveJobs);

        return response()->json([
            'success' => true,
            'jobs' => $liveJobs,
            'stats' => $stats,
            'page' => $page,
            'has_more' => count($liveJobs) >= 4,
            'timestamp' => now()->format('H:i:s T'),
        ]);
    }

    /**
     * Save Step-by-Step Onboarding Data from User & recalculate AI Recommendations.
     */
    public function completeOnboarding(Request $request)
    {
        $request->validate([
            'education' => ['required', 'string'],
            'experience_level' => ['required', 'string'],
            'target_role' => ['required', 'string'],
            'skills_list' => ['required'],
            'location' => ['nullable', 'string'],
            'work_mode' => ['nullable', 'string'],
            'career_goal' => ['nullable', 'string'],
        ]);

        try {
            $user = Auth::user();
            
            $skillsStr = is_array($request->skills_list)
                ? implode(', ', array_filter($request->skills_list))
                : (string) $request->skills_list;

            $updateData = [
                'education' => $request->education,
                'experience_level' => $request->experience_level,
                'current_status' => $request->experience_level,
                'target_role' => $request->target_role,
                'skills_list' => $skillsStr,
                'interested_field' => $request->target_role,
                'onboarding_completed' => true,
            ];

            if ($request->filled('career_goal')) {
                $updateData['career_goal'] = $request->career_goal;
            }
            if ($request->filled('location')) {
                $updateData['location'] = $request->location;
            }
            if ($request->filled('work_mode')) {
                $updateData['work_mode'] = $request->work_mode;
            }

            $user->update($updateData);

            // Fetch live jobs for newly selected role & location
            $locationQuery = $request->location ? $request->location : 'Indonesia';
            $liveJobs = $this->jobFetcher->fetchRealJobs($request->target_role, $skillsStr, $locationQuery);
            $stats = $this->computeUserStats($user, $liveJobs);

            return response()->json([
                'success' => true,
                'message' => 'Data profil & AI Analysis berhasil diperbarui!',
                'user' => [
                    'name' => $user->name,
                    'role' => $user->target_role,
                    'level' => $user->experience_level,
                    'education' => $user->education,
                    'skills_list' => $user->skills_list,
                    'location' => $user->location,
                    'work_mode' => $user->work_mode,
                    'career_goal' => $user->career_goal,
                    'onboarding_completed' => true,
                ],
                'stats' => $stats,
                'jobs' => $liveJobs,
            ]);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan data onboarding: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Handle Interactive AI Career Assistant Chat API requests using DeepSeek & Real Database Context.
     */
    public function chatWithAi(Request $request)
    {
        $user = Auth::user();
        $message = $request->input('message', '');
        $jobData = $request->input('job', null);
        $history = $request->input('history', []);
        $systemPrompt = $request->input('system_prompt', null); // 🌐 sistem prompt dari frontend (bahasa dinamis)
        $language = str_starts_with(strtolower((string) $request->input('language', 'id')), 'en') ? 'en' : 'id'; // bahasa aktif user

        if (empty(trim($message))) {
            return response()->json([
                'success' => false,
                'reply' => $language === 'en' ? 'Please type your question.' : 'Mohon tuliskan pertanyaan Anda.',
            ], 422);
        }

        // Query real DB records for authenticated user
        $activeCvId = session('active_cv_id');
        $latestCv = CvProfile::where('user_id', $user?->id)->where(function($q) use ($activeCvId) {
            if ($activeCvId) $q->where('id', $activeCvId);
        })->latest()->first();

        $cvAnalysis = $latestCv?->cvAnalysis;

        $userData = [
            'id' => $user?->id,
            'name' => $user?->name ?? 'Kandidat',
            'email' => $user?->email,
            'role' => $user?->target_role ?? 'Backend Developer',
            'target_role' => $user?->target_role ?? 'Backend Developer',
            'skills_list' => $user?->skills_list ?? 'PHP, Laravel, MySQL, REST API',
            'experience_level' => $user?->experience_level ?? 'Junior',
            'education' => $user?->education ?? 'Pendidikan Terdaftar',
            'has_cv' => !empty($latestCv),
            'cv_filename' => $latestCv?->original_filename ?? 'CV_Profil.pdf',
            'ats_score' => $cvAnalysis?->overall_score ?? ($latestCv ? 86 : null),
            'cv_summary' => $cvAnalysis?->ai_summary ?? $latestCv?->experience_summary,
            'cv_strengths' => $cvAnalysis?->strengths ?? [],
            'cv_opportunities' => $cvAnalysis?->opportunities ?? [],
            'language' => $language, // 🌐 teruskan bahasa ke service
        ];

        $reply = $this->aiService->chatWithAi($message, $userData, $jobData, $history, $systemPrompt);

        return response()->json([
            'success' => true,
            'reply' => $reply,
            'timestamp' => now()->format('H:i:s'),
        ]);
    }


    /**
     * Handle Interactive Career Roadmap AI Consultation & Real-time Master Plan Generation.
     */
    public function consultCareerRoadmap(Request $request)
    {
        $user = Auth::user();
        $message = $request->input('message', 'Buatkan peta jalan karir real-time sesuai isi CV saya.');
        $history = $request->input('history', []);

        $activeCvId = session('active_cv_id');
        $latestCv = CvProfile::where('user_id', $user?->id)->where(function($q) use ($activeCvId) {
            if ($activeCvId) $q->where('id', $activeCvId);
        })->latest()->first();

        $cvAnalysis = $latestCv?->cvAnalysis;

        $requestedRole = $request->input('target_role');
        $effectiveRole = $requestedRole ?: ($user?->target_role ?? 'Backend Developer');

        $userData = [
            'name' => $user?->name ?? 'Kandidat',
            'role' => $effectiveRole,
            'target_role' => $effectiveRole,
            'experience_level' => $user?->experience_level ?? 'Junior',
            'skills_list' => $user?->skills_list ?? 'PHP, Laravel, MySQL, REST API',
            'education' => $user?->education ?? 'Pendidikan Terdaftar',
        ];

        $cvData = [
            'has_cv' => !empty($latestCv),
            'filename' => $latestCv?->original_filename ?? 'CV_Profil.pdf',
            'ats_score' => $cvAnalysis?->overall_score ?? ($latestCv ? 84 : 75),
            'ai_summary' => $cvAnalysis?->ai_summary ?? 'CV Terverifikasi.',
            'strengths' => $cvAnalysis?->strengths ?? ['Pengalaman dasar terstruktur'],
            'red_flags' => $cvAnalysis?->red_flags ?? ['Belum menyertakan metrik kuantitatif'],
        ];

        $result = $this->aiService->generateCareerRoadmapConsultation($message, $userData, $cvData, $history);

        $finalTargetRole = $result['target_role'] ?? $effectiveRole;

        // Persist to CareerRoadmap table if user is authenticated and nodes are generated
        if ($user && !empty($result['nodes'])) {
            try {
                CareerRoadmap::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'target_role' => $finalTargetRole,
                        'nodes' => $result['nodes'],
                    ]
                );
            } catch (\Throwable $e) {
                Log::warning('Failed to persist career roadmap: ' . $e->getMessage());
            }
        }

        return response()->json([
            'success' => true,
            'data' => $result,
            'timestamp' => now()->format('H:i:s'),
        ]);
    }

    /**
     * Save/Update Career Roadmap directly from frontend (custom nodes/role changes).
     */
    public function saveCareerRoadmap(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $nodes = $request->input('nodes', []);
        $targetRole = $request->input('target_role', $user->target_role ?? 'Software Engineer');

        if (empty($nodes)) {
            return response()->json(['success' => false, 'message' => 'Data alur roadmap tidak boleh kosong'], 422);
        }

        try {
            $roadmap = CareerRoadmap::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'target_role' => $targetRole,
                    'nodes' => $nodes,
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Roadmap berhasil disimpan ke database.',
                'roadmap' => $roadmap,
            ]);
        } catch (\Throwable $e) {
            Log::error('Error saving career roadmap: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan roadmap: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Handle AI enhancement for CV Builder sections (Harvard STAR format)
     */
    public function enhanceCvBuilder(Request $request)
    {
        $user = Auth::user();
        $section = $request->input('section', 'summary');
        $currentData = $request->input('current_data', []);

        $userData = [
            'name' => $user?->name ?? 'Kandidat',
            'role' => $user?->target_role ?? 'Backend Developer',
            'target_role' => $user?->target_role ?? 'Backend Developer',
            'experience_level' => $user?->experience_level ?? 'Junior Level',
            'skills_list' => $user?->skills_list ?? 'PHP, Laravel, MySQL, REST API',
            'education' => $user?->education ?? 'Pendidikan Terdaftar',
        ];

        $enhanced = $this->aiService->enhanceCvSection($section, $currentData, $userData);

        return response()->json([
            'success' => true,
            'enhanced' => $enhanced,
            'timestamp' => now()->format('H:i:s'),
        ]);
    }

    /**
     * Translate full structured CV form content into target language via AI.
     */
    public function translateCv(Request $request)
    {
        $formData = $request->input('form', []);
        $targetLang = $request->input('target_language', 'en');

        if (empty($formData)) {
            return response()->json([
                'success' => false,
                'message' => 'Data formulir CV tidak boleh kosong.',
            ], 422);
        }

        $translatedForm = $this->aiService->translateCvForm($formData, $targetLang);

        return response()->json([
            'success' => true,
            'form' => $translatedForm,
            'message' => 'Seluruh isi CV berhasil diterjemahkan oleh AI!',
            'timestamp' => now()->format('H:i:s'),
        ]);
    }

    /**
     * Translate full structured Cover Letter form content into target language via AI.
     */
    public function translateCoverLetter(Request $request)
    {
        $formData = $request->input('form', []);
        $targetLang = $request->input('target_language', 'en');

        if (empty($formData)) {
            return response()->json([
                'success' => false,
                'message' => 'Data formulir Surat Lamaran tidak boleh kosong.',
            ], 422);
        }

        $translatedForm = $this->aiService->translateCoverLetterForm($formData, $targetLang);

        return response()->json([
            'success' => true,
            'form' => $translatedForm,
            'message' => 'Seluruh isi Surat Lamaran Kerja berhasil diterjemahkan oleh AI!',
            'timestamp' => now()->format('H:i:s'),
        ]);
    }

    /**
     * Generate or Rewrite Cover Letter Paragraphs using context-aware AI.
     */
    public function generateCoverLetterContent(Request $request)
    {
        $formData = $request->input('form', []);
        $targetLang = $request->input('target_language', 'id');
        $section = $request->input('section', 'all');

        $paragraphs = $this->aiService->generateCoverLetterContent($formData, $targetLang, $section);

        return response()->json([
            'success' => true,
            'paragraphs' => $paragraphs,
            'message' => 'Paragraf surat lamaran berhasil disempurnakan oleh AI!',
            'timestamp' => now()->format('H:i:s'),
        ]);
    }

    /**
     * AI-Powered Proofreading and Typo Fixer.
     */
    public function fixTypos(Request $request)
    {
        $fields = $request->input('fields', []);
        $language = $request->input('language', 'id');

        $fixedFields = [];
        foreach ($fields as $key => $text) {
            if (!empty($text)) {
                $fixedFields[$key] = $this->aiService->fixTyposInText($text, $language);
            } else {
                $fixedFields[$key] = $text;
            }
        }

        return response()->json([
            'success' => true,
            'fixed_fields' => $fixedFields,
            'message' => 'Typo berhasil diperbaiki oleh AI!',
            'timestamp' => now()->format('H:i:s'),
        ]);
    }

    /**
     * Import & Parse uploaded CV (PDF/DOCX/DOC/TXT) or active CV into structured CV Builder form state via AI.
     */
    public function importAndParseCv(Request $request, CvParserService $parser)
    {
        $user = Auth::user();
        $parsedText = '';
        $fileName = 'Berkas_CV.pdf';

        if ($request->filled('raw_text')) {
            $parsedText = $request->input('raw_text');
            $fileName = 'Teks_CV_Impor.txt';
        } elseif ($request->hasFile('cv')) {
            $file = $request->file('cv');
            $fileName = $file->getClientOriginalName();
            $ext = strtolower($file->getClientOriginalExtension());
            
            if (!in_array($ext, ['pdf', 'docx', 'doc', 'txt', 'rtf', 'csv'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Format berkas tidak didukung. Harap gunakan berkas PDF, DOCX, DOC, TXT, atau CSV.',
                ], 422);
            }

            $parsedText = $parser->extractText($file);

            // Prefer client-extracted text (PDF.js) if it has real readable content
            $clientText = trim($request->input('extracted_text', ''));
            if (!empty($clientText) && strlen($clientText) > 30) {
                // Check if client text has real readable words (not binary garbage)
                $wordCount = preg_match_all('/[a-zA-Z]{2,}/', $clientText);
                $clientTextRatio = $wordCount / max(1, strlen($clientText)) * 100;
                
                // If client text has reasonable word density (>5%), prefer it
                if ($clientTextRatio > 5 || strlen($clientText) > strlen($parsedText)) {
                    $parsedText = "DOCUMENT METADATA:\nFile Name: {$fileName}\n\nEXTRACTED CV TEXT:\n" . $clientText;
                }
            }

            // Save CV profile to DB for user
            if ($user) {
                try {
                    $cvProfile = CvProfile::create([
                        'user_id' => $user->id,
                        'original_filename' => $fileName,
                        'file_path' => 'cvs/' . $file->hashName(),
                        'file_size' => $file->getSize(),
                        'parsed_text' => $parsedText,
                        'status' => 'completed',
                    ]);
                    session(['active_cv_id' => $cvProfile->id]);
                } catch (\Throwable $e) {
                    // Ignore storage errors gracefully
                }
            }
        } elseif ($request->boolean('use_active_cv') && $user) {
            $activeCvId = session('active_cv_id');
            $activeCv = CvProfile::where('user_id', $user->id)->where(function($q) use ($activeCvId) {
                if ($activeCvId) $q->where('id', $activeCvId);
            })->latest()->first();

            if ($activeCv && !empty($activeCv->parsed_text)) {
                $parsedText = $activeCv->parsed_text;
                $fileName = $activeCv->original_filename;
            }
        }

        if (empty(trim($parsedText))) {
            return response()->json([
                'success' => false,
                'message' => 'Teks CV tidak dapat dibaca dari berkas. Silakan coba tempel teks CV Anda langsung pada tab Copy-Paste.',
            ], 422);
        }

        $defaultName = $user?->name ?? '';
        $defaultEmail = $user?->email ?? '';

        $form = $this->aiService->parseCvToStructuredForm($parsedText, $defaultName, $defaultEmail);

        return response()->json([
            'success' => true,
            'filename' => $fileName,
            'form' => $form,
            'message' => "✨ Berhasil! Berkas \"{$fileName}\" di-impor & diisi otomatis oleh AI ke formulir CV Builder.",
            'timestamp' => now()->format('H:i:s'),
        ]);
    }
}

