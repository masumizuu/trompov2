<?php

namespace App\Http\Controllers;

use App\Models\Sellable;
use App\Models\Business;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SellableController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth')->except(['index', 'show']);
    }

    public function index(Request $request)
    {
        $query = Sellable::query()->with('business');

        // Apply filters
        if ($request->has('business_id')) {
            $query->where('business_id', $request->business_id);
        }

        if ($request->has('price_range')) {
            list($min, $max) = explode('-', $request->price_range);
            
            if ($max === '+') {
                $query->where('price', '>=', $min);
            } else {
                $query->whereBetween('price', [$min, $max]);
            }
        }

        if ($request->has('availability')) {
            $query->where('available', $request->availability === 'available');
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('description', 'like', '%' . $search . '%');
            });
        }

        $sellables = $query->paginate(12);
        
        // Get all businesses for filter
        $businesses = Business::select('id', 'name')->get();
        
        // Check if user is a business owner
        $isOwner = false;
        if (Auth::check()) {
            $isOwner = Business::where('owner_id', Auth::id())->exists();
        }

        return Inertia::render('Sellable/Index', [
            'sellables' => $sellables,
            'businesses' => $businesses,
            'isOwner' => $isOwner,
        ]);
    }

    public function show($id)
    {
        $sellable = Sellable::with('business.owner')->findOrFail($id);
        
        $isOwner = false;
        if (Auth::check()) {
            $isOwner = $sellable->business->owner_id === Auth::id();
        }

        return Inertia::render('Sellable/Show', [
            'sellable' => $sellable,
            'isOwner' => $isOwner,
        ]);
    }

    public function create(Request $request)
    {
        // Get user's businesses
        $businesses = Business::where('owner_id', Auth::id())->get();
        
        if ($businesses->isEmpty()) {
            return redirect()->route('businesses.create')
                             ->with('error', 'You need to create a business first.');
        }
        
        $selectedBusinessId = $request->business_id;

        return Inertia::render('Sellable/Create', [
            'businesses' => $businesses,
            'selectedBusinessId' => $selectedBusinessId,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'available' => 'required|boolean',
            'business_id' => 'required|exists:businesses,id',
            'image' => 'nullable|image|max:2048',
        ]);

        // Check if user owns the business
        $business = Business::findOrFail($validated['business_id']);
        
        if ($business->owner_id !== Auth::id()) {
            return back()->with('error', 'You do not own this business.');
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('sellables', 'public');
            $validated['image'] = $path;
        }

        $sellable = Sellable::create($validated);

        return redirect()->route('sellables.show', $sellable->id)
                         ->with('success', 'Sellable created successfully.');
    }

    public function edit($id)
    {
        $sellable = Sellable::findOrFail($id);
        
        // Check if user owns the business
        $business = Business::findOrFail($sellable->business_id);
        
        if ($business->owner_id !== Auth::id()) {
            return redirect()->route('sellables.index')
                             ->with('error', 'You do not own this business.');
        }
        
        // Get user's businesses
        $businesses = Business::where('owner_id', Auth::id())->get();

        return Inertia::render('Sellable/Edit', [
            'sellable' => $sellable,
            'businesses' => $businesses,
        ]);
    }

    public function update(Request $request, $id)
    {
        $sellable = Sellable::findOrFail($id);
        
        // Check if user owns the business
        $business = Business::findOrFail($sellable->business_id);
        
        if ($business->owner_id !== Auth::id()) {
            return redirect()->route('sellables.index')
                             ->with('error', 'You do not own this business.');
        }
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'available' => 'required|boolean',
            'business_id' => 'required|exists:businesses,id',
            'image' => 'nullable|image|max:2048',
        ]);

        // Check if new business is owned by user
        $newBusiness = Business::findOrFail($validated['business_id']);
        
        if ($newBusiness->owner_id !== Auth::id()) {
            return back()->with('error', 'You do not own this business.');
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($sellable->image) {
                Storage::disk('public')->delete($sellable->image);
            }
            
            $path = $request->file('image')->store('sellables', 'public');
            $validated['image'] = $path;
        }

        $sellable->update($validated);

        return redirect()->route('sellables.show', $sellable->id)
                         ->with('success', 'Sellable updated successfully.');
    }

    public function destroy($id)
    {
        $sellable = Sellable::findOrFail($id);
        
        // Check if user owns the business
        $business = Business::findOrFail($sellable->business_id);
        
        if ($business->owner_id !== Auth::id()) {
            return redirect()->route('sellables.index')
                             ->with('error', 'You do not own this business.');
        }
        
        // Delete image if exists
        if ($sellable->image) {
            Storage::disk('public')->delete($sellable->image);
        }
        
        $sellable->delete();

        return redirect()->route('sellables.index')
                         ->with('success', 'Sellable deleted successfully.');
    }
}
