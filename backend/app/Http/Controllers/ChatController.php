<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    public function getMessages()
    {
        // Retrieve last 50 messages from SQLite
        return response()->json(DB::table('messages')->get());
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'sender_name' => 'required',
            'avatar' => 'required',
            'text' => 'required',
        ]);

        $newMessageId = DB::table('messages')->insertGetId([
            'sender_name' => $request->sender_name,
            'avatar' => $request->avatar,
            'text' => $request->text,
            'time' => now()->format('h:i A'),
            'is_me' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $message = DB::table('messages')->where('id', $newMessageId)->first();

        return response()->json($message, 201);
    }
}