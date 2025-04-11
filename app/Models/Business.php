<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Business extends Model
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
        'category_id',
        'owner_id',
        'location',
        'phone',
        'email',
        'website',
        'hours',
        'price_range',
        'image',
        'verified',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'verified' => 'boolean',
    ];

    /**
     * Get the owner of the business.
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Get the category of the business.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the sellables for the business.
     */
    public function sellables()
    {
        return $this->hasMany(Sellable::class);
    }

    /**
     * Get the reviews for the business.
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Get the disputes for the business.
     */
    public function disputes()
    {
        return $this->hasMany(Dispute::class);
    }

    /**
     * Get the users who saved this business.
     */
    public function savedByUsers()
    {
        return $this->belongsToMany(User::class, 'saved_businesses');
    }

    /**
     * Get the verification requests for the business.
     */
    public function verificationRequests()
    {
        return $this->hasMany(BusinessVerification::class);
    }

    /**
     * Get the average rating for the business.
     */
    public function getAverageRatingAttribute()
    {
        return $this->reviews()->avg('rating') ?? 0;
    }
}
