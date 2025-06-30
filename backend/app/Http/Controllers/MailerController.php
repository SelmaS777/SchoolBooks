<?php

namespace App\Http\Controllers;

use App\Utils\Mailer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="Mailer",
 *     description="Operations related to email sending"
 * )
 */
class MailerController extends Controller
{
    /**
     * @OA\Post(
     *      path="/send-mail",
     *      operationId="sendMail",
     *      tags={"Mailer"},
     *      summary="Send an email",
     *      description="Send an email to the specified recipient.",
     *      @OA\RequestBody(
     *          required=true,
     *          description="Email details",
     *          @OA\JsonContent(
     *              required={"to", "subject", "body"},
     *              @OA\Property(property="to", type="string", example="recipient@example.com"),
     *              @OA\Property(property="subject", type="string", example="Subject of the email"),
     *              @OA\Property(property="body", type="string", example="Body of the email")
     *          )
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Email sent successfully",
     *          @OA\JsonContent(
     *              @OA\Property(property="message", type="string", example="Email sent successfully.")
     *          )
     *      ),
     *      @OA\Response(
     *          response=500,
     *          description="Failed to send email",
     *          @OA\JsonContent(
     *              @OA\Property(property="message", type="string", example="Failed to send email.")
     *          )
     *      ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function sendMail(Request $request): JsonResponse
    {
        $to = $request->input('to');
        $subject = $request->input('subject');
        $body = $request->input('body');

        if (!Mailer::sendMail($to, $subject, $body)) {
            return response()->json(['message' => 'Failed to send email.'], 500);
        }
        return response()->json(['message' => 'Email sent successfully.']);
    }
}