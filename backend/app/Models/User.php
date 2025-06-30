<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
// Removed: use Illuminate\Database\Eloquent\Relations\HasOne; // If not used by other relationships
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
// Removed: use Laravel\Sanctum\HasApiTokens; // Removed Sanctum trait
use Tymon\JWTAuth\Contracts\JWTSubject;
// Removed: use App\Models\TOTPSecret; // Assuming this was imported
// Removed: use App\Models\PersonalAccessToken; // Assuming this was imported
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property mixed $id
 * @property mixed $full_name // Changed 'name' back to 'full_name' to match DB/fillable
 * // Removed: @property mixed $username
 * @property mixed $email
 * @property mixed $phone_number
 * @OA\Schema(
 * title="User",
 * description="User model",
 * @OA\Property( property="id", type="integer", description="ID", example="1"),
 * @OA\Property( property="full_name", type="string", description="Full name", example="John Doe"),
 * @OA\Property( property="email", type="string", format="email", description="Email", example="johndoe@example.com"),
 * @OA\Property( property="password", type="string", format="password", description="Password (hashed)", example="$2y$10$..." ),
 * @OA\Property( property="phone_number", type="string", description="Phone number", example="+1234567890", nullable=true),
 * @OA\Property( property="email_verified_at", type="string", format="date-time", description="Email verification timestamp", nullable=true),
 * @OA\Property( property="created_at", type="string", format="date-time", description="Creation timestamp"),
 * @OA\Property( property="updated_at", type="string", format="date-time", description="Last update timestamp")
 * )
 * @method static \Database\Factories\UserFactory factory($count = null, $state = []) // Added factory return type hint
 * @method static \Illuminate\Database\Eloquent\Builder|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User query()
 * @method static User create(array $attributes = []) // Added create return type hint
 */
class User extends Authenticatable implements JWTSubject
{
    // Removed: use HasApiTokens;
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'full_name', // Keeping this as full_name based on original
        // 'username', // Removed username
        'email',
        'password',
        'phone_number',
        'image_url', // Keep if used elsewhere
        'personal_details', // Keep if used elsewhere
        'city_id',
        'tier_id', 

    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed', // Keep this, Laravel handles hashing automatically on set
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier(): mixed
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims(): array
    {
        return [
            'user' => [
                'id' => $this->id,
                'full_name' => $this->full_name, // Use the correct property name
                // 'username' => $this->username, // Removed username
                'email' => $this->email,
                'phone_number' => $this->phone_number,
            ]
        ];
    }

    // --- Removed Relationships ---
    // public function totpSecret(): HasOne { ... }
    // public function personalAccessToken(): HasMany { ... }

    // --- Keep other relevant relationships ---
    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class); // Assuming Notification model exists
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class); // Assuming Order model exists
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class); // Assuming Review model exists
    }

    public function carts(): HasMany
    {
        return $this->hasMany(Cart::class); // Assuming Cart model exists
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function tier(): BelongsTo
    {
        return $this->belongsTo(Tier::class);
    }

    public function cards()
    {
        return $this->hasMany(Card::class);
    }

    public function defaultCard()
    {
        return $this->cards()->where('is_default', true)->first();
    }

    public function sellingProducts(): HasMany
    {
        return $this->hasMany(Product::class, 'seller_id');
    }

    public function boughtProducts(): HasMany
    {
        return $this->hasMany(Product::class, 'buyer_id');
    }

    public function wishlists(): HasMany
{
    return $this->hasMany(Wishlist::class);
}

public function savedSearches(): HasMany
{
    return $this->hasMany(SavedSearch::class);
}

    

}