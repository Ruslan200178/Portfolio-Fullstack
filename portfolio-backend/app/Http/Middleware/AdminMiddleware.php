<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Check if user is authenticated
        if (!$request->user()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Please login.',
            ], 401);
        }

        // Check if user is admin
        if (!$request->user()->is_admin) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Admin only.',
            ], 403);
        }

        return $next($request);
    }
}