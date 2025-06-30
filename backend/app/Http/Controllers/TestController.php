<?php

namespace App\Http\Controllers;

use App\Events\NotificationEvent;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TestController extends Controller
{
    /**
     * @OA\Post(
     *      path="/test-notification",
     *      tags={"Testing"},
     *      summary="Test notification broadcasting",
     *      description="Send a test notification to the authenticated user via Pusher",
     *      @OA\RequestBody(
     *          required=false,
     *          @OA\JsonContent(
     *              @OA\Property(
     *                  property="message",
     *                  type="string",
     *                  example="Custom test message",
     *                  description="Optional custom message for the notification"
     *              )
     *          )
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Notification sent successfully",
     *          @OA\JsonContent(
     *              @OA\Property(property="message", type="string", example="Notification sent successfully"),
     *              @OA\Property(property="user_id", type="integer", example="1"),
     *              @OA\Property(property="notification_message", type="string", example="Test notification")
     *          )
     *      ),
     *      @OA\Response(
     *          response=401,
     *          description="Unauthorized",
     *          @OA\JsonContent(
     *              @OA\Property(property="error", type="string", example="Unauthorized")
     *          )
     *      ),
     *      security={{"bearerAuth": {}}}
     * )
     */
    public function testNotification(Request $request): JsonResponse
    {
        $user = auth('api')->user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        
        $message = $request->input('message', 'Test notification from API!');
        
        event(new NotificationEvent(
            $message,
            $user->id,
            'info'
        ));
        
        return response()->json([
            'message' => 'Notification sent successfully',
            'user_id' => $user->id,
            'notification_message' => $message
        ]);
    }
}