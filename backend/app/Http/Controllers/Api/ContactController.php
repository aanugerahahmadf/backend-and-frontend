<?php

namespace App\Http\Controllers\Api;

use App\Models\Contact;
use Illuminate\Http\JsonResponse;

class ContactController extends \App\Http\Controllers\Controller
{
    public function index(): JsonResponse
    {
        try {
            $contacts = Contact::all();
            
            return response()->json($contacts);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch contacts',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
