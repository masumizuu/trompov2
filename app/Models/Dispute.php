<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dispute extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'business_id',
        'transaction_id',
        'title',
        'description',
        'status',
        'resolution',
    ];

    /**
     * Get the user that created the dispute.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the business involved in the dispute.
     */
    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    /**
     * Get the transaction involved in the dispute.
     */
    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    /**
     * Get the messages for the dispute.
     */
    public function messages()
    {
        return $this->hasMany(DisputeMessage::class);
    }
}
