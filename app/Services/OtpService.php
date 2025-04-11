<?php

namespace App\Services;

use App\Models\Otp;
use Illuminate\Support\Str;

class OtpService
{
    /**
     * Generate a new OTP for the given email
     *
     * @param string $email
     * @param string $type
     * @return string
     */
    public function generateOtp(string $email, string $type = 'verification'): string
    {
        // Invalidate any existing OTPs for this email and type
        $this->invalidateOtp($email, $type);
        
        // Generate a random 6-digit OTP
        $otp = (string) random_int(100000, 999999);
        
        // Store the OTP in the database
        Otp::create([
            'email' => $email,
            'otp' => $otp,
            'type' => $type,
            'expires_at' => now()->addMinutes(15), // OTP expires in 15 minutes
        ]);
        
        return $otp;
    }
    
    /**
     * Verify if the provided OTP is valid for the given email
     *
     * @param string $email
     * @param string $otp
     * @param string $type
     * @return bool
     */
    public function verifyOtp(string $email, string $otp, string $type = 'verification'): bool
    {
        $otpRecord = Otp::where('email', $email)
                       ->where('otp', $otp)
                       ->where('type',  $type)
                       ->where('expires_at', '>', now())
                       ->where('used', false)
                       ->first();
        
        if (!$otpRecord) {
            return false;
        }
        
        // Mark OTP as used
        $otpRecord->used = true;
        $otpRecord->save();
        
        return true;
    }
    
    /**
     * Invalidate all OTPs for the given email and type
     *
     * @param string $email
     * @param string $type
     * @return void
     */
    public function invalidateOtp(string $email, string $type = 'verification'): void
    {
        Otp::where('email', $email)
           ->where('type', $type)
           ->update(['used' => true]);
    }
}
