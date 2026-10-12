<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserPreferenceController extends Controller
{
    /**
     * Simpan preferensi bahasa user ke database.
     * Dipanggil dari React LanguageSwitcher secara silent (fire-and-forget).
     *
     * PATCH /api/user/language
     */
    public function updateLanguage(Request $request)
    {
        $validated = $request->validate([
            'language' => ['required', 'string', 'in:id,en'],
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user) {
            // Guest — tidak perlu simpan ke DB, localStorage sudah cukup
            return response()->json(['status' => 'guest'], 200);
        }

        $user->update(['language' => $validated['language']]);

        return response()->json([
            'status'   => 'ok',
            'language' => $user->language,
        ]);
    }
}
