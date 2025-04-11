<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Auth\OtpVerificationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BusinessController;
use App\Http\Controllers\SellableController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\DisputeController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\BusinessController as AdminBusinessController;
use App\Http\Controllers\Admin\VerificationController as AdminVerificationController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Public routes
Route::get('/', function () {
    return Inertia::render('Welcome');
});

// Authentication routes
Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

Route::get('/register', [RegisterController::class, 'showRegistrationForm'])->name('register');
Route::post('/register', [RegisterController::class, 'register']);

Route::get('/forgot-password', [ForgotPasswordController::class, 'showLinkRequestForm'])->name('password.request');
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');

Route::get('/reset-password', [ResetPasswordController::class, 'showResetForm'])->name('password.reset');
Route::post('/reset-password', [ResetPasswordController::class, 'reset'])->name('password.update');

Route::get('/verify-otp', [OtpVerificationController::class, 'showVerificationForm'])->name('verify.otp.form');
Route::post('/verify-otp', [OtpVerificationController::class, 'verify'])->name('verify.otp');
Route::post('/resend-otp', [OtpVerificationController::class, 'resend'])->name('resend.otp');

// Protected routes
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/password', [ProfileController::class, 'updatePassword'])->name('password.update');
    
    // Business routes
    Route::resource('businesses', BusinessController::class);
    Route::post('/businesses/{id}/save', [BusinessController::class, 'toggleSave'])->name('businesses.save');
    
    // Sellable routes
    Route::resource('sellables', SellableController::class);
    
    // Review routes
    Route::resource('reviews', ReviewController::class);
    
    // Dispute routes
    Route::resource('disputes', DisputeController::class);
    
    // Message routes
    Route::get('/messages', [MessageController::class, 'index'])->name('messages.index');
    Route::get('/messages/conversation/{userId}', [MessageController::class, 'conversation'])->name('messages.conversation');
    Route::post('/messages/send', [MessageController::class, 'send'])->name('messages.send');
    
    // API routes for notifications
    Route::get('/api/notifications', [MessageController::class, 'getNotifications'])->name('api.notifications');
    Route::post('/api/notifications/{id}/read', [MessageController::class, 'markNotificationAsRead'])->name('api.notifications.read');
    
    // Verification routes
    Route::get('/verification/user/request', [VerificationController::class, 'showUserVerificationForm'])->name('user.verification.request  [VerificationController::class, 'showUserVerificationForm'])->name('user.verification.request');
    Route::post('/verification/user/request', [VerificationController::class, 'requestUserVerification']);
    
    Route::get('/verification/business/{id}/request', [VerificationController::class, 'showBusinessVerificationForm'])->name('business.verification.request');
    Route::post('/verification/business/{id}/request', [VerificationController::class, 'requestBusinessVerification']);
    
    // Admin routes
    Route::middleware(['admin'])->prefix('admin')->name('admin.')->group(function () {
        // User management
        Route::resource('users', AdminUserController::class);
        
        // Business management
        Route::resource('businesses', AdminBusinessController::class);
        
        // Verification management
        Route::get('/verifications', [AdminVerificationController::class, 'index'])->name('verifications.index');
        
        Route::get('/verifications/user/{id}', [AdminVerificationController::class, 'showUserVerification'])->name('verifications.user.show');
        Route::post('/verifications/user/{id}/approve', [AdminVerificationController::class, 'approveUserVerification'])->name('verifications.user.approve');
        Route::post('/verifications/user/{id}/deny', [AdminVerificationController::class, 'denyUserVerification'])->name('verifications.user.deny');
        
        Route::get('/verifications/business/{id}', [AdminVerificationController::class, 'showBusinessVerification'])->name('verifications.business.show');
        Route::post('/verifications/business/{id}/approve', [AdminVerificationController::class, 'approveBusinessVerification'])->name('verifications.business.approve');
        Route::post('/verifications/business/{id}/deny', [AdminVerificationController::class, 'denyBusinessVerification'])->name('verifications.business.deny');
    });
});

// Public business and sellable routes
Route::get('/businesses', [BusinessController::class, 'index'])->name('businesses.index');
Route::get('/businesses/{id}', [BusinessController::class, 'show'])->name('businesses.show');
Route::get('/sellables', [SellableController::class, 'index'])->name('sellables.index');
Route::get('/sellables/{id}', [SellableController::class, 'show'])->name('sellables.show');

// Search routes
Route::get('/search', [SearchController::class, 'index'])->name('search');
