<?php

namespace App\Http\Controllers;

use App\Models\InterviewSession;
use App\Services\AiCareerService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InterviewSimulatorController extends Controller
{
    public function submitAnswer(Request $request, AiCareerService $aiService)
    {
        $request->validate([
            'role' => ['required', 'string'],
            'difficulty' => ['required', 'string'],
            'question' => ['required', 'string'],
            'answer' => ['required', 'string', 'min:5'],
        ]);

        $evaluation = $aiService->evaluateInterviewAnswer(
            $request->role,
            $request->question,
            $request->answer
        );

        $session = InterviewSession::create([
            'user_id' => Auth::id(),
            'target_role' => $request->role,
            'difficulty' => $request->difficulty,
            'question' => $request->question,
            'user_answer' => $request->answer,
            'technical_score' => $evaluation['technical_score'],
            'communication_score' => $evaluation['communication_score'],
            'relevance_score' => $evaluation['relevance_score'],
            'overall_score' => $evaluation['overall_score'],
            'feedback' => $evaluation['feedback'],
        ]);

        return back()->with([
            'interviewFeedback' => $evaluation,
            'sessionId' => $session->id,
        ]);
    }
}
