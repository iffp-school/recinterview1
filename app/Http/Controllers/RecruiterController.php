<?php
namespace App\Http\Controllers;

use App\Models\Recruiter;
use Illuminate\Http\Request;

class RecruiterController extends Controller
{
    public function index()
    {
        return Recruiter::all();
    }

    public function store(Request $request)
    {
        $recruiter = Recruiter::create($request->all());
        return response()->json($recruiter, 201);
    }

    public function show($id)
    {
        return Recruiter::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $recruiter = Recruiter::findOrFail($id);
        $recruiter->update($request->all());
        return response()->json($recruiter, 200);
    }

    public function destroy($id)
    {
        Recruiter::destroy($id);
        return response()->json(null, 204);
    }
}
