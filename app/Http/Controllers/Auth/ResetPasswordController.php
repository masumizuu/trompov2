<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\OtpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ResetPasswordController extends Controller
{
    protected $otpService;

    public function __construct(OtpService $otpService)
    {
        $this->middleware('guest');
        $this->otpService = $otpService;
    }

    public function showResetForm(Request $request)
    {
        $email = $request->session()->get('email');
        
        if (!$email) {
            return redirect()->route('password.request');
        }

        return Inertia::render('Auth/ResetPassword', [
            'email' => $email,
            'status' => session('status')
        ]);
    }

    public function reset(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|string|size:6',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $email = $request->email;
        $otp = $request->otp;

        if ($this->otpService->verifyOtp($email, $otp, 'password_reset')) {
            // Update user password
            $user = User::where('email', $email)->first();
            $user->password = Hash::make($request->password);
            $user->save();

            // Invalidate OTP
            $this->otpService->invalidateOtp($email, 'password_reset');

            return redirect()->route('login')->with('status', 'Your password has been reset successfully.');
        }

        return back()->withErrors([
            'otp' => 'The verification code is invalid or has expired.'
        ])->with('email', $email);
    }
}
