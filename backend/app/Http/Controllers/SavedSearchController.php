<?php

namespace App\Http\Controllers;

use App\Models\SavedSearch;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * @OA\Tag(
 *     name="SavedSearches",
 *     description="Operations about saved searches"
 * )
 */
class SavedSearchController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * @OA\Get(
     *      path="/saved-searches",
     *      tags={"SavedSearches"},
     *      summary="Get user's saved searches",
     *      description="Returns current user's saved search queries",
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(
     *              type="array",
     *              @OA\Items(ref="#/components/schemas/SavedSearch")
     *          )
     *      ),
     *      security={{"bearerAuth": {}}}
     * )
     */
    public function index(): JsonResponse
    {
        $savedSearches = SavedSearch::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($savedSearches);
    }

    /**
     * @OA\Post(
     *      path="/saved-searches",
     *      tags={"SavedSearches"},
     *      summary="Save a search query",
     *      description="Save a search query for the current user",
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              required={"search_query"},
     *              @OA\Property(property="search_query", type="string", example="javascript programming"),
     *              @OA\Property(property="search_name", type="string", nullable=true, example="Programming Books")
     *          )
     *      ),
     *      @OA\Response(
     *          response=201,
     *          description="Search saved successfully",
     *          @OA\JsonContent(ref="#/components/schemas/SavedSearch")
     *      ),
     *      @OA\Response(
     *          response=400,
     *          description="Search already saved or validation error"
     *      ),
     *      security={{"bearerAuth": {}}}
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'search_query' => 'required|string|max:255',
            'search_name' => 'nullable|string|max:255'
        ]);

        // Check if the same search query already exists for this user
        $existingSearch = SavedSearch::where('user_id', Auth::id())
            ->where('search_query', $request->search_query)
            ->first();

        if ($existingSearch) {
            return response()->json(['error' => 'This search is already saved'], 400);
        }

        // Create new saved search
        $savedSearch = SavedSearch::create([
            'user_id' => Auth::id(),
            'search_query' => $request->search_query,
            'search_name' => $request->search_name ?? $request->search_query,
        ]);

        return response()->json($savedSearch, 201);
    }

    /**
     * @OA\Get(
     *      path="/saved-searches/{id}",
     *      tags={"SavedSearches"},
     *      summary="Get specified saved search",
     *      description="Returns specified saved search (only if it belongs to current user)",
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          description="ID of the saved search",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/SavedSearch")
     *      ),
     *      @OA\Response(
     *          response=404,
     *          description="Saved search not found"
     *      ),
     *      security={{"bearerAuth": {}}}
     * )
     */
    public function show(SavedSearch $savedSearch): JsonResponse
    {
        // Ensure the saved search belongs to the authenticated user
        if ($savedSearch->user_id !== Auth::id()) {
            return response()->json(['error' => 'Saved search not found'], 404);
        }

        return response()->json($savedSearch);
    }

    /**
     * @OA\Put(
     *      path="/saved-searches/{id}",
     *      tags={"SavedSearches"},
     *      summary="Update saved search",
     *      description="Update a saved search name (only if it belongs to current user)",
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          description="ID of the saved search",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              @OA\Property(property="search_name", type="string", example="Updated Search Name")
     *          )
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Search updated successfully",
     *          @OA\JsonContent(ref="#/components/schemas/SavedSearch")
     *      ),
     *      @OA\Response(
     *          response=404,
     *          description="Saved search not found"
     *      ),
     *      security={{"bearerAuth": {}}}
     * )
     */
    public function update(Request $request, SavedSearch $savedSearch): JsonResponse
    {
        // Ensure the saved search belongs to the authenticated user
        if ($savedSearch->user_id !== Auth::id()) {
            return response()->json(['error' => 'Saved search not found'], 404);
        }

        $request->validate([
            'search_name' => 'required|string|max:255'
        ]);

        $savedSearch->update([
            'search_name' => $request->search_name
        ]);

        return response()->json($savedSearch);
    }

    /**
     * @OA\Delete(
     *      path="/saved-searches/{id}",
     *      tags={"SavedSearches"},
     *      summary="Delete saved search",
     *      description="Delete a saved search (only if it belongs to current user)",
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          description="ID of the saved search",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Search deleted successfully"
     *      ),
     *      @OA\Response(
     *          response=404,
     *          description="Saved search not found"
     *      ),
     *      security={{"bearerAuth": {}}}
     * )
     */
    public function destroy(SavedSearch $savedSearch): JsonResponse
    {
        // Ensure the saved search belongs to the authenticated user
        if ($savedSearch->user_id !== Auth::id()) {
            return response()->json(['error' => 'Saved search not found'], 404);
        }

        $savedSearch->delete();
        return response()->json(['message' => 'Saved search deleted successfully']);
    }

    /**
     * @OA\Delete(
     *      path="/saved-searches/clear",
     *      tags={"SavedSearches"},
     *      summary="Clear all saved searches",
     *      description="Remove all saved searches for the current user",
     *      @OA\Response(
     *          response=200,
     *          description="All saved searches cleared successfully"
     *      ),
     *      security={{"bearerAuth": {}}}
     * )
     */
    public function clear(): JsonResponse
    {
        SavedSearch::where('user_id', Auth::id())->delete();

        return response()->json(['message' => 'All saved searches cleared successfully']);
    }

    /**
     * @OA\Get(
     *      path="/saved-searches/count",
     *      tags={"SavedSearches"},
     *      summary="Get saved searches count",
     *      description="Get the total number of saved searches for the current user",
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(
     *              @OA\Property(property="count", type="integer", example="5")
     *          )
     *      ),
     *      security={{"bearerAuth": {}}}
     * )
     */
    public function count(): JsonResponse
    {
        $count = SavedSearch::where('user_id', Auth::id())->count();

        return response()->json(['count' => $count]);
    }
}