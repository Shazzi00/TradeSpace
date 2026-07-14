<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MockApiController extends Controller
{
    // 1. Mock Login (Accepts any email with the password "password")
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if ($request->password === 'password') {
            return response()->json([
                'user' => [
                    'name' => 'Bessie Cooper',
                    'email' => $request->email,
                ],
                'token' => 'mock_token_xyz123'
            ], 200);
        }

        return response()->json(['message' => 'Invalid credentials. Hint: Use password "password"'], 401);
    }

    // 2. Mock Workspace Data (Matches your sleek meeting/task designs)
    public function getWorkspaceData()
    {
        return response()->json([
            'meetings' => [
                [
                    'id' => 1,
                    'time' => '9:00 - 10:00',
                    'title' => 'Morning Standup Meeting',
                    'description' => 'Prepare weekly report on lead conversion statistics.',
                    'team' => 'Design Team',
                ],
                [
                    'id' => 2,
                    'time' => '14:00 - 15:00',
                    'title' => 'Project Review Meeting',
                    'description' => 'Discuss the main page design assets.',
                    'team' => 'Marketing Team',
                ],
                [
                    'id' => 3,
                    'time' => '16:00 - 17:00',
                    'title' => 'Daily Team Synch',
                    'description' => 'Quick round of updates on roadblocks and current sprints.',
                    'team' => 'Developers Team',
                ]
            ],
            'task_stats' => [
                'completed' => 12,
                'pending' => 12,
                'total' => 24
            ],
            'working_hours' => 10,
            'team_members' => 21
        ]);
    }

    // 3. Mock E-Commerce Data (Matches your sales/revenue metrics)
    public function getEcommerceData()
    {
        return response()->json([
            'total_revenue' => 99560,
            'total_orders' => 35,
            'net_profit' => 60450,
            'total_visitors' => 45600,
            'pending_confirmations' => 12,
            'sales_by_category' => [
                ['category' => 'Apple MacBook Air M2', 'amount' => 55640, 'percentage' => 55],
                ['category' => 'Apple Watch Series 9', 'amount' => 11420, 'percentage' => 20],
                ['category' => 'Acoustics JBL Charge 5', 'amount' => 8500, 'percentage' => 15],
                ['category' => 'Accessories & Cables', 'amount' => 2120, 'percentage' => 10]
            ]
        ]);
    }
}