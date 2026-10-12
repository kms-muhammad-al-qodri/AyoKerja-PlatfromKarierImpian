<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    public function index()
    {
        if (Auth::check()) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Landing', [
            'stats' => [
                'confidenceScore' => 92,
                'opportunitiesCount' => 24,
                'skillsIdentified' => 12,
                'jobMatchPercentage' => 94,
            ]
        ]);
    }
}
