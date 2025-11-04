<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class EnsureSuperAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip check for login page
        if ($request->routeIs('filament.admin.auth.login')) {
            return $next($request);
        }

        // Check if user is authenticated and has Super Admin role
        if (!Auth::check() || !Auth::user()->hasRole('Super Admin')) {
            abort(403, 'Unauthorized. Only Super Admin can access this panel.');
        }

        return $next($request);
    }
}
