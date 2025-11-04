<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class ProxyToFrontend
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // If it's an API request, continue with the normal flow
        if (str_starts_with($request->path(), 'api/')) {
            return $next($request);
        }

        // If it's an admin request, continue with the normal flow
        if (str_starts_with($request->path(), 'admin/')) {
            return $next($request);
        }

        // Proxy all other requests to the Next.js standalone server
        $url = 'http://localhost:3000' . $request->getRequestUri();

        try {
            // Use cURL directly for better control
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($ch, CURLOPT_HEADER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 30);

            // Forward request headers
            $requestHeaders = [];
            foreach ($request->headers->all() as $key => $values) {
                foreach ($values as $value) {
                    $requestHeaders[] = $key . ': ' . $value;
                }
            }
            curl_setopt($ch, CURLOPT_HTTPHEADER, $requestHeaders);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);

            // Get all headers
            $headerContent = substr($response, 0, $headerSize);
            $body = substr($response, $headerSize);

            curl_close($ch);

            if ($response !== false) {
                // Parse all headers
                $headers = [];
                $headerLines = explode("\r\n", $headerContent);
                foreach ($headerLines as $line) {
                    if (strpos($line, ':') !== false) {
                        list($key, $value) = explode(':', $line, 2);
                        $headers[trim($key)] = trim($value);
                    }
                }

                // Create response with all original headers
                $laravelResponse = response($body, $httpCode);

                // Forward all headers except those that might cause issues
                $skipHeaders = [
                    'transfer-encoding',
                    'connection',
                    'server',
                    'date'
                ];

                foreach ($headers as $key => $value) {
                    if (!in_array(strtolower($key), $skipHeaders)) {
                        $laravelResponse->header($key, $value);
                    }
                }

                return $laravelResponse;
            }
        } catch (\Exception $e) {
            Log::error('ProxyToFrontend error: ' . $e->getMessage());
        }

        // If proxying fails, continue with normal flow
        return $next($request);
    }
}
