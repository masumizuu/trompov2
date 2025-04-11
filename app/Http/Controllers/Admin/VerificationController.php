<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UserVerification;
use App\Models\BusinessVerification;
use App\Models\User;
use App\Models\Business;
use App\Mail\VerificationApproved;
use App\Mail\VerificationDenied;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class VerificationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('admin');
    }

    public function index()
    {
        $userVerifications = UserVerification::with('user')
                                           ->latest()
                                           ->get()
                                           ->map(function ($verification) {
                                               return [
                                                   'id' => $verification->id,
                                                   'type' => 'user',
                                                   'status' => $verification->status,
                                                   'created_at' => $verification->created_at,
                                                   'entity' => [
                                                       'id' => $verification->user->id,
                                                       'name' => $verification->user->name,
                                                       'email' => $verification->user->email,
                                                   ],
                                                   'documents' => $verification->documents,
                                               ];
                                           });

        $businessVerifications = BusinessVerification::with('business.owner')
                                                   ->latest()
                                                   ->get()
                                                   ->map(function ($verification) {
                                                       return [
                                                           'id' => $verification->id,
                                                           'type' => 'business',
                                                           'status' => $verification->status,
                                                           'created_at' => $verification->created_at,
                                                           'entity' => [
                                                               'id' => $verification->business->id,
                                                               'name' => $verification->business->name,
                                                           ],
                                                           'documents' => $verification->documents,
                                                       ];
                                                   });

        return Inertia::render('Admin/Verifications/Index', [
            'userVerifications' => $userVerifications,
            'businessVerifications' => $businessVerifications,
        ]);
    }

    public function showUserVerification($id)
    {
        $verification = UserVerification::with('user')->findOrFail($id);

        return Inertia::render('Admin/Verifications/ShowUser', [
            'verification' => $verification,
        ]);
    }

    public function showBusinessVerification($id)
    {
        $verification = BusinessVerification::with('business.owner')->findOrFail($id);

        return Inertia::render('Admin/Verifications/ShowBusiness', [
            'verification' => $verification,
        ]);
    }

    public function approveUserVerification($id)
    {
        $verification = UserVerification::with('user')->findOrFail($id);
        
        if ($verification->status !== 'pending') {
            return back()->with('error', 'This verification has already been processed.');
        }
        
        // Update verification status
        $verification->status = 'approved';
        $verification->approved_by = auth()->id();
        $verification->approved_at = now();
        $verification->save();
        
        // Update user verified status
        $user = $verification->user;
        $user->verified = true;
        $user->save();
        
        // Send notification email
        Mail::to($user->email)->send(new VerificationApproved('user'));

        return redirect()->route('admin.verifications.index')
                         ->with('success', 'User verification approved successfully.');
    }

    public function approveBusinessVerification($id)
    {
        $verification = BusinessVerification::with('business.owner')->findOrFail($id);
        
        if ($verification->status !== 'pending') {
            return back()->with('error', 'This verification has already been processed.');
        }
        
        // Update verification status
        $verification->status = 'approved';
        $verification->approved_by = auth()->id();
        $verification->approved_at = now();
        $verification->save();
        
        // Update business verified status
        $business = $verification->business;
        $business->verified = true;
        $business->save();
        
        // Send notification email to business owner
        $owner = $business->owner;
        Mail::to($owner->email)->send(new VerificationApproved('business', $business->name));

        return redirect()->route('admin.verifications.index')
                         ->with('success', 'Business verification approved successfully.');
    }

    public function denyUserVerification(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string',
        ]);

        $verification = UserVerification::with('user')->findOrFail($id);
        
        if ($verification->status !== 'pending') {
            return back()->with('error', 'This verification has already been processed.');
        }
        
        // Update verification status
        $verification->status = 'denied';
        $verification->denied_by = auth()->id();
        $verification->denied_at = now();
        $verification->denial_reason = $request->reason;
        $verification->save();
        
        // Send notification email
        $user = $verification->user;
        Mail::to($user->email)->send(new VerificationDenied('user', $request->reason));

        return redirect()->route('admin.verifications.index')
                         ->with('success', 'User verification denied successfully.');
    }

    public function denyBusinessVerification(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string',
        ]);

        $verification = BusinessVerification::with('business.owner')->findOrFail($id);
        
        if ($verification->status !== 'pending') {
            return back()->with('error', 'This verification has already been processed.');
        }
        
        // Update verification status
        $verification->status = 'denied';
        $verification->denied_by = auth()->id();
        $verification->denied_at = now();
        $verification->denial_reason = $request->reason;
        $verification->save();
        
        // Send notification email to business owner
        $owner = $verification->business->owner;
        $businessName = $verification->business->name;
        Mail::to($owner->email)->send(new VerificationDenied('business', $request->reason, $businessName));

        return redirect()->route('admin.verifications.index')
                         ->with('success', 'Business verification denied successfully.');
    }
}
