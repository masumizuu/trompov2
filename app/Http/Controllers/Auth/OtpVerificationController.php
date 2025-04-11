<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\OtpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OtpVerificationController extends Controller
{
    protected $otpService;

    public function __construct(OtpService $otpService)
    {
        $this->otpService = $otpService;
    }

    public function showVerificationForm()
    {
        $email = session('email');
        
        if (!$email) {
            return redirect()->route('login');
        }

        return Inertia::render('Auth/VerifyOTP', [
            'email' => $email,
            'status' => session('status')
        ]);
    }

    public function verify(Request $request)
    {
        $request->validate([
            'otp' => 'required|string|size:6',
            'email' => 'required|email'
        ]);

        $email = $request->email;
        $otp = $request->otp;

        if ($this->otpService->verifyOtp($email, $otp)) {
            // Update user status to verified
            $user = User::where('email', $email)->first();
            $user->status = 'active';
            $user->email_verified_at = now();
            $user->save();

            // Log the user in
            Auth::login($user);

            return redirect()->route('dashboard');
        }

        return back()->withErrors([
            'otp' => 'The verification code is invalid or has expired.'
        ])->with('email', $email);
    }

    public function resend(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ]);

        $email = $request->email;
        
        // Generate new OTP
        $otp = $this->otpService->generateOtp($email);

        // Send OTP email
        Mail::to($email)->send(new OtpVerification($otp));

        return back()->with([
            'status' => 'A new verification code has been sent to your email address.',
            'email' => $email
        ]);
    }
}
