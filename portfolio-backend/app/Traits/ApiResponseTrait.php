<?php

namespace App\Traits;

trait ApiResponseTrait
{
    // Success Response
    public function successResponse($data, $message = 'Success', $code = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data'    => $data,
        ], $code);
    }

    // Error Response
    public function errorResponse($message = 'Error', $code = 400, $errors = null)
    {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }

    // Not Found Response
    public function notFoundResponse($message = 'Resource not found')
    {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], 404);
    }

    // Validation Error Response
    public function validationErrorResponse($errors)
    {
        return response()->json([
            'success' => false,
            'message' => 'Validation error',
            'errors'  => $errors,
        ], 422);
    }
}