<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Throwable;

class AuthController extends Controller
{
    public function showLogin()
    {
        if (Auth::check()) {
            return redirect()->route('dashboard');
        }
        return Inertia::render('Login');
    }

    public function showRegister()
    {
        if (Auth::check()) {
            return redirect()->route('dashboard');
        }
        return Inertia::render('Register');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ], [
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format alamat email tidak valid.',
            'password.required' => 'Kata sandi wajib diisi.',
        ]);

        try {
            if (Auth::attempt($credentials, $request->boolean('remember'))) {
                $request->session()->regenerate();
                return redirect()->route('dashboard');
            }

            return back()->withErrors([
                'email' => 'Email atau kata sandi yang Anda masukkan tidak cocok dengan data kami.',
            ]);
        } catch (Throwable $e) {
            return back()->withErrors([
                'general' => 'Gagal terhubung ke database / server: ' . $e->getMessage(),
            ]);
        }
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['nullable', 'string', 'in:user,admin,hrd,jobseeker'],
            'education' => ['nullable', 'string'],
            'experience_level' => ['nullable', 'string'],
            'target_role' => ['nullable', 'string'],
            'skills_list' => ['nullable'],
            'career_goal' => ['nullable', 'string'],
            'work_mode' => ['nullable', 'string'],
            'location' => ['nullable', 'string', 'max:255'],
            'avatar' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Alamat email ini sudah terdaftar. Silakan gunakan email lain.',
            'password.required' => 'Kata sandi wajib diisi.',
            'password.min' => 'Kata sandi minimal 8 karakter.',
            'avatar.image' => 'File foto harus berupa gambar.',
            'avatar.max' => 'Ukuran foto maksimal 2MB.',
        ]);

        try {
            $skillsStr = is_array($request->skills_list)
                ? implode(', ', array_filter($request->skills_list))
                : (string) ($request->skills_list ?? '');

            $targetRole = $request->target_role ?? 'Belum Ditentukan';
            $careerGoal = $request->career_goal ?? ("Target menjadi {$targetRole} unggulan.");

            // Handle avatar upload
            $avatarPath = null;
            if ($request->hasFile('avatar')) {
                $avatarPath = $request->file('avatar')->store('avatars', 'public');
            }

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role ?? 'user',
                'education' => $request->education ?? '',
                'experience_level' => $request->experience_level ?? 'Fresh Graduate',
                'current_status' => $request->experience_level ?? 'Fresh Graduate',
                'target_role' => $targetRole,
                'skills_list' => $skillsStr,
                'career_goal' => $careerGoal,
                'interested_field' => $targetRole,
                'work_mode' => $request->work_mode ?? 'Remote / Hybrid',
                'location' => $request->location ?? '',
                'avatar' => $avatarPath,
                'onboarding_completed' => true,
            ]);

            Auth::login($user);

            return redirect()->route('dashboard')
                ->with('welcome', 'Selamat datang di AyoKerja, ' . $user->name . '! Akun Anda berhasil terdaftar. AI siap membimbing karir Anda.')
                ->with('is_new_user', true);
        } catch (Throwable $e) {
            return back()->withErrors([
                'general' => 'Gagal mendaftarkan akun: ' . $e->getMessage(),
            ]);
        }
    }

    public function demoLogin()
    {
        try {
            $user = User::firstOrCreate(
                ['email' => 'demo@careerai.id'],
                [
                    'name' => 'Rizki Dev (Demo User)',
                    'password' => Hash::make('password123'),
                    'role' => 'user',
                    'target_role' => 'Backend Developer',
                    'experience_level' => 'Junior',
                ]
            );

            Auth::login($user);

            return redirect()->route('dashboard');
        } catch (Throwable $e) {
            return back()->withErrors([
                'general' => 'Gagal login demo: ' . $e->getMessage(),
            ]);
        }
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}

