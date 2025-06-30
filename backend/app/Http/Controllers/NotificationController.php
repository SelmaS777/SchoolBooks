<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * @OA\Tag(
 *     name="Notifications",
 *     description="Operations related to notifications"
 * )
 */
class NotificationController extends Controller
{
    /**
     * @OA\Get(
     *      path="/notifications",
     *      tags={"Notifications"},
     *      summary="Get current user's notifications",
     *      description="Returns list of notifications for the authenticated user",
     *      @OA\Parameter(
     *          name="unread_only",
     *          in="query",
     *          description="Filter to only unread notifications",
     *          @OA\Schema(type="boolean")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(
     *              type="object",
     *              @OA\Property(
     *                  property="notifications",
     *                  type="array",
     *                  @OA\Items(ref="#/components/schemas/Notification")
     *              ),
     *              @OA\Property(property="unread_count", type="integer", example="5")
     *          )
     *      ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = Notification::where('user_id', Auth::id())
            ->with('order')
            ->orderBy('created_at', 'desc');

        if ($request->boolean('unread_only')) {
            $query->where('is_read', false);
        }

        $notifications = $query->get();
        $unreadCount = Notification::where('user_id', Auth::id())
            ->where('is_read', false)
            ->count();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount
        ]);
    }

    /**
     * @OA\Post(
     *      path="/notifications/{id}/mark-read",
     *      tags={"Notifications"},
     *      summary="Mark a notification as read",
     *      description="Mark a specific notification as read",
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          description="ID of the notification",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Notification marked as read",
     *          @OA\JsonContent(
     *              @OA\Property(property="message", type="string", example="Notification marked as read")
     *          )
     *      ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function markAsRead(Notification $notification): JsonResponse
    {
        if ($notification->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $notification->markAsRead();

        return response()->json(['message' => 'Notification marked as read']);
    }

    /**
     * @OA\Post(
     *      path="/notifications/mark-all-read",
     *      tags={"Notifications"},
     *      summary="Mark all notifications as read",
     *      description="Mark all notifications for the authenticated user as read",
     *      @OA\Response(
     *          response=200,
     *          description="All notifications marked as read",
     *          @OA\JsonContent(
     *              @OA\Property(property="message", type="string", example="All notifications marked as read")
     *          )
     *      ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function markAllAsRead(): JsonResponse
    {
        Notification::where('user_id', Auth::id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['message' => 'All notifications marked as read']);
    }

    /**
     * @OA\Get(
     *      path="/notifications/{id}",
     *      tags={"Notifications"},
     *      summary="Get specified notification",
     *      description="Returns specified notification",
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          description="ID of the notification",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/Notification")
     *      ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function show(Notification $notification): JsonResponse
    {
        if ($notification->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json($notification->load('order'));
    }

    /**
     * @OA\Delete(
     *      path="/notifications/{id}",
     *      tags={"Notifications"},
     *      summary="Delete specified notification",
     *      description="Delete specified notification",
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          description="ID of the notification",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation"
     *      ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function destroy(Notification $notification): JsonResponse
    {
        if ($notification->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json($notification->delete());
    }
}