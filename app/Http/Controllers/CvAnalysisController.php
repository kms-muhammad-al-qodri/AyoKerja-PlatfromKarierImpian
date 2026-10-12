<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\CvParserService;
use App\Services\AiCareerService;
use App\Services\JobFetcherService;
use App\Models\CvProfile;
use App\Models\CvAnalysis;
use Illuminate\Support\Facades\Auth;

class CvAnalysisController extends Controller
{
    protected CvParserService $cvParser;
    protected AiCareerService $aiService;
    protected JobFetcherService $jobFetcher;

    public function __construct(
        CvParserService $cvParser,
        AiCareerService $aiService,
        JobFetcherService $jobFetcher
    ) {
        $this->cvParser = $cvParser;
        $this->aiService = $aiService;
        $this->jobFetcher = $jobFetcher;
    }

    /**
     * Display the CV Analysis page.
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();
        $initialResult = null;
        $initialJobs = [];
        $targetRole = $user?->target_role ?: 'Software Engineer / Backend Dev';

        if ($user) {
            $latestAnalysis = CvAnalysis::with('cvProfile')
                ->where('user_id', $user->id)
                ->latest()
                ->first();

            if ($latestAnalysis) {
                $profile = $latestAnalysis->cvProfile;
                $targetRole = $profile->detected_role ?: ($user->target_role ?: 'Software Engineer / Backend Dev');
                $skills = $profile->raw_skills ?? ['PHP', 'Laravel', 'MySQL'];

                $score = $latestAnalysis->overall_score;
                $verdict = $score >= 80 ? 'SANGAT LAYAK (SIAP BERSAING)' : ($score >= 65 ? 'KOMPETITIF (PERLU OPTIMASI SKOR ATS)' : 'BERPOTENSI (PERLU TAMBAHAN KATA KUNCI)');
                $badge = $score >= 80 ? 'success' : 'warning';

                $initialResult = [
                    'overall_score' => $score,
                    'verdict' => $verdict,
                    'verdict_badge' => $badge,
                    'detected_role' => $targetRole,
                    'content_score' => $latestAnalysis->content_score,
                    'structure_score' => $latestAnalysis->structure_score,
                    'skills_score' => $latestAnalysis->skills_score,
                    'experience_score' => $latestAnalysis->experience_score,
                    'impact_score' => $latestAnalysis->impact_score,
                    'strengths' => $latestAnalysis->strengths ?? [],
                    'red_flags' => $latestAnalysis->opportunities ?? [],
                    'actionable_recommendations' => $latestAnalysis->opportunities ?? [],
                    'detected_skills' => $skills,
                    'recommended_keywords' => array_slice($skills, 0, 5),
                    'ai_summary' => $latestAnalysis->ai_summary ?? '',
                ];

                $initialJobs = $this->jobFetcher->fetchRealJobs($targetRole, $skills);
            }
        }

        return Inertia::render('CvAnalysis', [
            'auth' => [
                'user' => $user,
            ],
            'userRegisteredRole' => $user?->target_role,
            'initialResult' => $initialResult,
            'initialJobs' => $initialJobs,
            'targetRole' => $targetRole,
        ]);
    }

    /**
     * Analyze uploaded CV file or text and fetch live job recommendations.
     */
    public function analyze(Request $request)
    {
        $request->validate([
            'cv_file' => 'nullable|file|mimes:pdf,txt,doc,docx|max:10240',
            'cv_text' => 'nullable|string',
            'target_role' => 'nullable|string|max:100',
        ]);

        $targetRole = $request->input('target_role') ?: (Auth::user()?->target_role ?: 'Software Engineer / Backend Dev');
        $parsedText = '';
        $originalFilename = 'Input_Teks_CV.txt';
        $fileSize = 1024;

        if ($request->hasFile('cv_file')) {
            $file = $request->file('cv_file');
            $originalFilename = $file->getClientOriginalName();
            $fileSize = $file->getSize();
            $parsedText = $this->cvParser->extractText($file);
        } elseif ($request->filled('cv_text')) {
            $parsedText = $request->input('cv_text');
            $fileSize = strlen($parsedText);
        } else {
            $parsedText = "Muhammad Rizki - Junior Backend Engineer. Skillset: PHP, Laravel, MySQL, REST API, React, Git, Tailwind CSS. Experience building Web Applications & REST API.";
        }

        // 1. DeepSeek AI Real-time Analysis with Senior HRD persona
        $analysisResult = $this->aiService->analyzeCv($parsedText, $targetRole);

        // 2. Fetch live job recommendations from Database & Adzuna/Jooble APIs matching candidate skills
        $detectedSkills = $analysisResult['detected_skills'] ?? ['PHP', 'Laravel', 'MySQL', 'REST API', 'React'];
        $recommendedJobs = $this->jobFetcher->fetchRealJobs($targetRole, $detectedSkills);

        // 3. Save to database if user is authenticated
        $user = Auth::user();
        if ($user) {
            try {
                $cvProfile = CvProfile::create([
                    'user_id' => $user->id,
                    'original_filename' => $originalFilename,
                    'file_path' => 'cvs/' . md5($parsedText . time()) . '.txt',
                    'file_size' => $fileSize,
                    'parsed_text' => $parsedText,
                    'raw_skills' => $detectedSkills,
                    'career_confidence' => $analysisResult['overall_score'] ?? 85,
                    'detected_role' => $analysisResult['detected_role'] ?? $targetRole,
                    'status' => 'completed',
                ]);

                CvAnalysis::create([
                    'user_id' => $user->id,
                    'cv_profile_id' => $cvProfile->id,
                    'overall_score' => $analysisResult['overall_score'] ?? 85,
                    'content_score' => $analysisResult['content_score'] ?? 88,
                    'structure_score' => $analysisResult['structure_score'] ?? 90,
                    'skills_score' => $analysisResult['skills_score'] ?? 85,
                    'experience_score' => $analysisResult['experience_score'] ?? 82,
                    'impact_score' => $analysisResult['impact_score'] ?? 78,
                    'strengths' => $analysisResult['strengths'] ?? [],
                    'opportunities' => $analysisResult['red_flags'] ?? [],
                    'ai_summary' => $analysisResult['ai_summary'] ?? '',
                ]);
            } catch (\Throwable $e) {
                // Ignore storage error if DB save fails
            }
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'analysisResult' => $analysisResult,
                'recommendedJobs' => $recommendedJobs,
                'targetRole' => $targetRole,
            ]);
        }

        return Inertia::render('CvAnalysis', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'userRegisteredRole' => Auth::user()?->target_role,
            'initialResult' => $analysisResult,
            'initialJobs' => $recommendedJobs,
            'targetRole' => $targetRole,
        ]);
    }
}
