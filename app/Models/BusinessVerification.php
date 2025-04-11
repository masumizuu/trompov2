<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessVerification extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'business_id',
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
     * Get the business that requested verification.
     */
    public function business()
    {
        return $this->belongsTo(Business::class);
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
