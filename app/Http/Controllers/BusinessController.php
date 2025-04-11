<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\Category;
use App\Models\Review;
use App\Models\Sellable;
use App\Models\SavedBusiness;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BusinessController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth')->except(['index', 'show']);
    }

    public function index(Request $request)
    {
        $query = Business::query();

        // Apply filters
        if ($request->has('category')) {
            $query->where('category_id', $request->category);
        }

        if ($request->has('location')) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        if ($request->has('price_range')) {
            $query->where('price_range', $request->price_range);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('description', 'like', '%' . $search . '%');
            });
        }

        $businesses = $query->with('category')->paginate(12);
        
        // Get all categories and locations for filters
        $categories = Category::all();
        $locations = Business::distinct('location')->pluck('location');

        return Inertia::render('Business/Index', [
            'businesses' => $businesses,
            'categories' => $categories,
            'locations' => $locations,
        ]);
    }

    public function show($id)
    {
        $business = Business::with('category', 'owner')->findOrFail($id);
        $sellables = Sellable::where('business_id', $id)->get();
        $reviews = Review::with('user')->where('business_id', $id)->latest()->get();
        
        $isOwner = false;
        $isSaved = false;
        
        if (Auth::check()) {
            $user = Auth::user();
            $isOwner = $business->owner_id === $user->id;
            $isSaved = SavedBusiness::where('user_id', $user->id)
                                   ->where('business_id', $id)
                                   ->exists();
        }

        return Inertia::render('Business/Show', [
            'business' => $business,
            'sellables' => $sellables,
            'reviews' => $reviews,
            'isOwner' => $isOwner,
            'isSaved' => $isSaved,
        ]);
    }

    public function create()
    {
        $this->authorize('create', Business::class);
        
        $categories = Category::all();
        
        return Inertia::render('Business/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Business::class);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'location' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'website' => 'nullable|url|max:255',
            'hours' => 'nullable|string|max:255',
            'price_range' => 'required|in:low,medium,high',
            'image' => 'nullable|image|max:2048',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('businesses', 'public');
            $validated['image'] = $path;
        }

        $validated['owner_id'] = Auth::id();
        $validated['verified'] = false;

        $business = Business::create($validated);

        return redirect()->route('businesses.show', $business->id)
                         ->with('success', 'Business created successfully.');
    }

    public function edit($id)
    {
        $business = Business::findOrFail($id);
        
        $this->authorize('update', $business);
        
        $categories = Category::all();
        
        return Inertia::render('Business/Edit', [
            'business' => $business,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, $id)
    {
        $business = Business::findOrFail($id);
        
        $this->authorize('update', $business);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'location' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'website' => 'nullable|url|max:255',
            'hours' => 'nullable|string|max:255',
            'price_range' => 'required|in:low,medium,high',
            'image' => 'nullable|image|max:2048',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($business->image) {
                Storage::disk('public')->delete($business->image);
            }
            
            $path = $request->file('image')->store('businesses', 'public');
            $validated['image'] = $path;
        }

        $business->update($validated);

        return redirect()->route('businesses.show', $business->id)
                         ->with('success', 'Business updated successfully.');
    }

    public function destroy($id)
    {
        $business = Business::findOrFail($id);
        
        $this->authorize('delete', $business);
        
        // Delete image if exists
        if ($business->image) {
            Storage::disk('public')->delete($business->image);
        }
        
        $business->delete();

        return redirect()->route('businesses.index')
                         ->with('success', 'Business deleted successfully.');
    }

    public function toggleSave($id)
    {
        $user = Auth::user();
        $business = Business::findOrFail($id);
        
        $savedBusiness = SavedBusiness::where('user_id', $user->id)
                                     ->where('business_id', $id)
                                     ->first();
        
        if ($savedBusiness) {
            $savedBusiness->delete();
            $message = 'Business removed from saved list.';
        } else {
            SavedBusiness::create([
                'user_id' => $user->id,
                'business_id' => $id,
            ]);
            $message = 'Business added to saved list.';
        }

        return back()->with('success', $message);
    }
}
