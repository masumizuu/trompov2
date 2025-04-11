<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sellable extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'price',
        'available',
        'business_id',
        'image',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'float',
        'available' => 'boolean',
    ];

    /**
     * Get the business that owns the sellable.
     */
    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    /**
     * Get the transactions for the sellable.
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
