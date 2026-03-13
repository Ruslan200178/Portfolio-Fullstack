<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ContactController extends Controller
{
    // Public: send message
    public function store(Request $request)
    {
        $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        $contact = Contact::create([
            'name'    => $request->name,
            'email'   => $request->email,
            'subject' => $request->subject,
            'message' => $request->message,
            'is_read' => false,
            'read_at' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully! I will get back to you soon.',
            'data'    => $contact,
        ], 201);
    }

    // Admin: list all messages
    public function index()
    {
        $contacts = Contact::orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'data'    => $contacts,
            'unread'  => $contacts->where('is_read', false)->count(),
            'total'   => $contacts->count(),
        ]);
    }

    // Admin: mark as read
    public function markRead(Contact $contact)
    {
        $contact->update([
            'is_read' => true,
            'read_at' => Carbon::now(),
        ]);
        return response()->json([
            'success' => true,
            'message' => 'Marked as read',
            'data'    => $contact->fresh(),
        ]);
    }

    // Admin: delete message
    public function destroy(Contact $contact)
    {
        $contact->delete();
        return response()->json(['success' => true, 'message' => 'Message deleted']);
    }
}
