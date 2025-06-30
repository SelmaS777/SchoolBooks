<?php

namespace App\Http\Controllers;

// Standard Laravel & JWT related imports
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\User; // Assuming your User model is here
use Illuminate\Support\Facades\Hash; // For hashing passwords
use Illuminate\Support\Facades\Log; // For logging errors
use Illuminate\Validation\ValidationException; // To catch validation errors if using Validator::make
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Mail\ResetPasswordMail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

// Removed: use App\Models\TOTPSecret;
// Removed: use App\Utils\Validator; // Will use Laravel's built-in validator
use Carbon\Carbon; // Still used for timestamp in error response examples
// Removed: use OTPHP\TOTP;

class AuthController extends Controller // Assuming it extends a base Controller
{
    /**
     * Create a new AuthController instance.
     * Ensure middleware is applied (using 'api' guard for JWT)
     * Adjust middleware as needed (e.g., 'auth:api' for protected routes)
     *
     * @return void
     */
    public function __construct()
    {
        // Apply JWT middleware to all methods except login and register
        // 'auth:api' ensures a valid JWT is present
        $this->middleware('auth:api', ['except' => ['login', 'register', 'forgotPassword', 'resetPassword', 'testEmail']]);
    }

    /**
     * @OA\Post(
     * path="/auth/login",
     * tags={"Authentication"},
     * summary="User login",
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"email", "password"},
     * @OA\Property(property="email", type="string", format="email", example="test@example.com"),
     * @OA\Property(property="password", type="string", format="password", example="password")
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Login successful",
     * @OA\JsonContent(
     * @OA\Property(property="access_token", type="string"),
     * @OA\Property(property="token_type", type="string", example="bearer"),
     * @OA\Property(property="expires_in", type="integer", example=3600)
     * )
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthorized (Invalid Credentials)",
     * @OA\JsonContent( @OA\Property(property="error", type="string", example="Unauthorized") )
     * ),
     * @OA\Response(
     * response=422,
     * description="Validation error",
     * @OA\JsonContent( @OA\Property(property="errors", type="object") )
     * )
     * )
     */
    public function login(Request $request): JsonResponse
    {
        // --- Use Laravel's Built-in Validation ---
        try {
            $credentials = $request->validate([
                'email' => ['required', 'string', 'email'],
                'password' => ['required', 'string'],
            ]);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
        // --- Use Auth::attempt for Authentication ---
        // Ensure your config/auth.php 'guards' => ['api' => ['driver' => 'jwt', ...]] is set
        if (!$token = auth('api')->attempt($credentials)) {
            // Authentication failed...
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = auth('api')->user();

        // --- Return standard JWT response ---
        return $this->respondWithToken($token,$user);
    }

    /**
     * @OA\Post(
     * path="/auth/register",
     * tags={"Authentication"},
     * summary="User registration",
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"fullName", "password", "email"},
     * @OA\Property(property="fullName", type="string", example="Test User"),
     * @OA\Property(property="password", type="string", format="password", example="Password123!"),
     * @OA\Property(property="password_confirmation", type="string", format="password", example="Password123!"),
     * @OA\Property(property="email", type="string", format="email", example="test@example.com"),
     * @OA\Property(property="phoneNumber", type="string", format="phone", example="+1234567890", nullable=true)
     * )
     * ),
     * @OA\Response(
     * response=201,
     * description="Registration successful",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string"),
     * @OA\Property(property="user", type="object")
     * )
     * ),
     * @OA\Response(
     * response=422,
     * description="Validation error",
     * @OA\JsonContent( @OA\Property(property="errors", type="object") )
     * ),
     * @OA\Response(
     * response=500,
     * description="Registration failed",
     * @OA\JsonContent( @OA\Property(property="message", type="string") )
     * )
     * )
     */
    public function register(Request $request): JsonResponse
    {
        // --- Use Laravel's Built-in Validation ---
        try {
            $validatedData = $request->validate([
                'fullName' => ['required', 'string', 'max:100', 'regex:/^[a-zA-Z\s]+$/'], // Kept your regex
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'], // Added unique check
                'password' => [
                    'required',
                    'string',
                    'min:8',
                    'max:30', // Optional
                    'confirmed', // Requires 'password_confirmation' field
                    'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/' // Kept your complex regex
                ],
                'phoneNumber' => ['nullable', 'string', 'min:5', 'max:20'], // Simplified phone validation
            ]);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }

        // --- Create User ---
        try {
            $user = User::create([
                'full_name' => $validatedData['fullName'], // Use 'full_name' to match User model
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'phone_number' => $validatedData['phoneNumber'] ?? null,
                'tier_id' => 1, // Automatically assign Free tier (ID 1)
            ]);

            // Success response
            return response()->json([
                'message' => 'Registration successful!',
                // Optionally return user data, excluding sensitive info
                'user' => $user->only(['id', 'name', 'email'])
             ], 201); // Use 201 Created status code

        } catch (\Exception $e) {
            // Log the actual error for debugging
            Log::error('User registration failed: ' . $e->getMessage());
            // Generic error response to the user
            return response()->json(['message' => 'Registration failed. Please try again later.'], 500);
        }
    }

        /**
         * @OA\Get(
         * path="/auth/me",
         * tags={"Authentication"},
         * summary="Get the authenticated User with relationships",
         * security={{"bearerAuth": {}}},
         * @OA\Response(
         * response=200,
         * description="Successful operation",
         * @OA\JsonContent(type="object")
         * ),
         * @OA\Response(response=401, description="Unauthenticated")
         * )
         */
        public function me(): JsonResponse
        {
            // Get authenticated user
            $user = auth('api')->user();
            
            // Load relationships
            $user->load(['city', 'tier', 'cards']);
            
            return response()->json($user);
        }

    /**
     * @OA\Post(
     * path="/auth/logout",
     * tags={"Authentication"},
     * summary="Log the user out (Invalidate the token)",
     * security={{"bearerAuth": {}}},
     * @OA\Response(
     * response=200,
     * description="Successfully logged out",
     * @OA\JsonContent( @OA\Property(property="message", type="string") )
     * ),
     * @OA\Response( response=401, description="Unauthenticated" )
     * )
     */
    public function logout(): JsonResponse
    {
        auth('api')->logout(); // This invalidates the token by adding it to the blacklist (if configured)

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * @OA\Post(
     * path="/auth/refresh",
     * tags={"Authentication"},
     * summary="Refresh a token",
     * security={{"bearerAuth": {}}},
     * @OA\Response(
     * response=200,
     * description="Token refreshed successfully",
     * @OA\JsonContent(
     * @OA\Property(property="access_token", type="string"),
     * @OA\Property(property="token_type", type="string", example="bearer"),
     * @OA\Property(property="expires_in", type="integer", example=3600)
     * )
     * ),
     * @OA\Response( response=401, description="Unauthenticated" )
     * )
     */
    public function refresh(): JsonResponse
    {
        // Refresh the token (invalidates old, returns new)
        return $this->respondWithToken(auth('api')->refresh());
    }

    /**
     * @OA\Get(
     * path="/auth/validateToken",
     * tags={"Authentication"},
     * summary="Validate user token",
     * security={{"bearerAuth": {}}},
     * @OA\Response( response=200, description="Token is valid", @OA\JsonContent( @OA\Property(property="message", type="string"))),
     * @OA\Response( response=401, description="Unauthorized" ),
     * @OA\Response( response=500, description="Token validation error")
     * )
     */
    public function validateToken(): JsonResponse
    {
        // auth('api')->check() implicitly validates the token provided in the request header
        try {
            if (!auth('api')->check()) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
            // If check() passes, the token is valid
            return response()->json(['message' => 'Token is valid'], 200);
        } catch (\Exception $e) {
             Log::error('Token validation error: ' . $e->getMessage());
            // Catch potential exceptions during token processing
            return response()->json(['error' => 'An error occurred while validating the token'], 500);
        }
    }

    // --- Removed TOTP Methods ---
    // function generateTOTPSecret(): JsonResponse { ... }
    // function generateTOTPQRCode(): JsonResponse { ... }
    // function validateTOTPSecret(Request $request): JsonResponse { ... }


    /**
     * Get the token array structure.
     *
     * @param string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken(string $token, ?User $user = null): JsonResponse // Accept optional User
    {
        $response = [
            'access_token' => $token, // Standard key name
            'token_type' => 'bearer',
            // Get TTL from config (in minutes) and convert to seconds
            'expires_in' => auth('api')->factory()->getTTL() * 60
        ];

        // If user object is provided, add selected details to the response
        if ($user) {
            $response['user'] = $user->only([
                'id',
                'full_name',
                'email',
                'phone_number',
                // Add any other non-sensitive fields you need on the frontend immediately
            ]);
            // You could also add 'user_id' separately if needed, but it's already in the 'user' object
            // $response['user_id'] = $user->id;
        }

        return response()->json($response);
    }



    /**
     * @OA\Post(
     *     path="/auth/forgot-password",
     *     tags={"Authentication"},
     *     summary="Send password reset email",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email"},
     *             @OA\Property(property="email", type="string", format="email", example="user@example.com")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Reset link sent successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="We have emailed your password reset link!")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(@OA\Property(property="errors", type="object"))
     *     )
     * )
     */
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $email = $request->email;
        
        // Generate token
        $token = Str::random(64);
        
        // Delete existing tokens for this email
        DB::table('password_resets')->where('email', $email)->delete();
        
        // Store new token
        DB::table('password_resets')->insert([
            'email' => $email,
            'token' => $token,
            'created_at' => now(),
        ]);
        
        try {
            // Send email
            Mail::to($email)->send(new ResetPasswordMail($token, $email));
            
            return response()->json([
                'message' => 'We have emailed your password reset link!'
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send password reset email: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Unable to send reset email. Please try again later.'
            ], 500);
        }
    }
    /**
     * @OA\Post(
     *     path="/auth/reset-password",
     *     tags={"Authentication"},
     *     summary="Reset password with token",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"token", "email", "password", "password_confirmation"},
     *             @OA\Property(property="token", type="string", example="abc123..."),
     *             @OA\Property(property="email", type="string", format="email", example="user@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="NewPassword123!"),
     *             @OA\Property(property="password_confirmation", type="string", format="password", example="NewPassword123!")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Password reset successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Your password has been reset!")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid or expired token",
     *         @OA\JsonContent(@OA\Property(property="message", type="string"))
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(@OA\Property(property="errors", type="object"))
     *     )
     * )
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        // Check if token exists and is not expired (60 minutes)
        $reset = DB::table('password_resets')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->where('created_at', '>', now()->subMinutes(60))
            ->first();

        if (!$reset) {
            return response()->json([
                'message' => 'This password reset token is invalid or has expired.'
            ], 400);
        }

        // Update user password
        $user = User::where('email', $request->email)->first();
        $user->update([
            'password' => Hash::make($request->password)
        ]);

        // Delete the reset token
        DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json([
            'message' => 'Your password has been reset successfully!'
        ]);
    }

    /**
     * @OA\Post(
     *     path="/auth/test-email",
     *     tags={"Testing"},
     *     summary="Test email functionality",
     *     description="Send a test email to verify Mailgun configuration",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email"},
     *             @OA\Property(property="email", type="string", format="email", example="test@example.com")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Test email sent successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Test email sent successfully!"),
     *             @OA\Property(property="email", type="string", example="test@example.com"),
     *             @OA\Property(property="token", type="string", example="abc123...")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Email sending failed",
     *         @OA\JsonContent(@OA\Property(property="message", type="string"))
     *     )
     * )
     */
    public function testEmail(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $email = $request->email;
        $token = Str::random(64);
        
        try {
            // Send test email using the same template
            Mail::to($email)->send(new ResetPasswordMail($token, $email));
            
            return response()->json([
                'message' => 'Test email sent successfully!',
                'email' => $email,
                'token' => $token,
                'mailgun_domain' => env('MAILGUN_DOMAIN'),
                'from_address' => env('MAIL_FROM_ADDRESS')
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send test email: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to send test email: ' . $e->getMessage(),
                'error_details' => [
                    'mailgun_domain' => env('MAILGUN_DOMAIN'),
                    'mailgun_secret_set' => !empty(env('MAILGUN_SECRET')),
                    'from_address' => env('MAIL_FROM_ADDRESS')
                ]
            ], 500);
        }
    }
}