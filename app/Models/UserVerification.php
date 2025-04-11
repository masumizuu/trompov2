<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserVerification extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'documents',
        'status',
        'approved_by',
        'approved_at',
        'denied_by',
        'denied_at',
        'denial_reason',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'documents' => 'array',
        'approved_at' => 'datetime',
        'denied_at' => 'datetime',
    ];

    /**
     * Get the user that requested verification.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the admin that approved the verification.
     */
    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Get the admin that denied the verification.
     */
    public function deniedBy()
    {
        return $this->belongsTo(User::class, 'denied_by');
    }
}
