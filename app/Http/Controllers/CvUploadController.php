<?php

namespace App\Http\Controllers;

use App\Models\CvProfile;
use App\Models\CvAnalysis;
use App\Services\AiCareerService;
use App\Services\CvParserService;
use App\Services\JobFetcherService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CvUploadController extends Controller
{
    public function showUpload()
    {
        return Inertia::render('Dashboard', ['initialTab' => 'overview', 'triggerUpload' => true]);
    }

    public function processUpload(Request $request, CvParserService $parser, AiCareerService $aiService, JobFetcherService $jobFetcher)
    {
        $request->validate([
            'cv' => ['required', 'file', 'mimes:pdf,txt,doc,docx', 'max:10240'],
        ]);

        $file = $request->file('cv');
        $parsedText = $parser->extractText($file);
        $analysisResult = $aiService->analyzeCv($parsedText, 'Backend Developer');
        $detectedSkills = $analysisResult['detected_skills'] ?? ['PHP', 'Laravel', 'MySQL'];
        $recommendedJobs = $jobFetcher->fetchRealJobs($analysisResult['detected_role'] ?? 'Backend Developer', $detectedSkills);

        $user = Auth::user();
        if ($user) {
            $cvProfile = CvProfile::create([
                'user_id' => $user->id,
                'original_filename' => $file->getClientOriginalName(),
                'file_path' => 'cvs/' . $file->hashName(),
                'file_size' => $file->getSize(),
                'parsed_text' => $parsedText,
                'raw_skills' => $detectedSkills,
                'career_confidence' => $analysisResult['overall_score'] ?? 85,
                'detected_role' => $analysisResult['detected_role'] ?? 'Backend Developer',
                'status' => 'completed',
            ]);

            session(['active_cv_id' => $cvProfile->id]);

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
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'analysisResult' => $analysisResult,
                'recommendedJobs' => $recommendedJobs,
            ]);
        }

        return redirect()->route('analyze-cv')->with('success', 'CV analyzed successfully!');
    }
}
