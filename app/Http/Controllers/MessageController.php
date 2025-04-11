<?php

namespace App\Http\Controllers;

use App\Events\NewMessage;
use App\Models\Conversation;
use App\Models\ConversationParticipant;
use App\Models\Message;
use App\Models\Notification;
use App\Models\ReadReceipt;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MessageController extends Controller
{
    /**
     * Display a listing of the user's conversations.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $user = Auth::user();
        
        // Get all conversations where the user is a participant
        $conversations = ConversationParticipant::where('userId', $user->user_id)
            ->with(['conversation' => function ($query) {
                $query->with(['participants.user' => function ($query) {
                    $query->select('user_id', 'first_name', 'last_name', 'profile_picture');
                }]);
                $query->withCount(['messages as unread_count' => function ($query) use ($user) {
                    $query->whereDoesntHave('readBy', function ($q) use ($user) {
                        $q->where('userId', $user->user_id);
                    });
                }]);
                $query->with(['messages' => function ($query) {
                    $query->latest()->first();
                }]);
            }])
            ->get()
            ->map(function ($participant) use ($user) {
                $conversation = $participant->conversation;
                
                // For non-group chats, set the title to the other participant's name
                if (!$conversation->isGroup) {
                    $otherParticipant = $conversation->participants
                        ->where('userId', '!=', $user->user_id)
                        ->first();
                    
                    if ($otherParticipant) {
                        $otherUser = $otherParticipant->user;
                        $conversation->title = $otherUser->first_name . ' ' . $otherUser->last_name;
                    }
                }
                
                return $conversation;
            });
        
        return Inertia::render('Messages/Index', [
            'conversations' => $conversations,
            'currentConversation' => null
        ]);
    }

    /**
     * Display a specific conversation.
     *
     * @param  string  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $user = Auth::user();
        
        // Check if the user is a participant in this conversation
        $participant = ConversationParticipant::where('conversationId', $id)
            ->where('userId', $user->user_id)
            ->first();
        
        if (!$participant) {
            abort(403, 'You are not a participant in this conversation');
        }
        
        // Update last seen
        $participant->lastSeen = now();
        $participant->save();
        
        // Get the conversation with participants and messages
        $conversation = Conversation::with(['participants.user' => function ($query) {
                $query->select('user_id', 'first_name', 'last_name', 'profile_picture');
            }])
            ->with(['messages' => function ($query) {
                $query->with(['sender' => function ($query) {
                    $query->select('user_id', 'first_name', 'last_name', 'profile_picture');
                }]);
                $query->with('readBy');
                $query->orderBy('timestamp', 'asc');
            }])
            ->findOrFail($id);
        
        // Mark all unread messages as read
        $unreadMessages = Message::where('conversationId', $id)
            ->whereDoesntHave('readBy', function ($query) use ($user) {
                $query->where('userId', $user->user_id);
            })
            ->where('senderId', '!=', $user->user_id)
            ->get();
        
        foreach ($unreadMessages as $message) {
            ReadReceipt::create([
                'messageId' => $message->message_id,
                'userId' => $user->user_id
            ]);
        }
        
        // Get all conversations for the sidebar
        $conversations = ConversationParticipant::where('userId', $user->user_id)
            ->with(['conversation' => function ($query) {
                $query->with(['participants.user' => function ($query) {
                    $query->select('user_id', 'first_name', 'last_name', 'profile_picture');
                }]);
                $query->withCount(['messages as unread_count' => function ($query) use ($user) {
                    $query->whereDoesntHave('readBy', function ($q) use ($user) {
                        $q->where('userId', $user->user_id);
                    });
                }]);
                $query->with(['messages' => function ($query) {
                    $query->latest()->first();
                }]);
            }])
            ->get()
            ->map(function ($participant) use ($user) {
                $conversation = $participant->conversation;
                
                // For non-group chats, set the title to the other participant's name
                if (!$conversation->isGroup) {
                    $otherParticipant = $conversation->participants
                        ->where('userId', '!=', $user->user_id)
                        ->first();
                    
                    if ($otherParticipant) {
                        $otherUser = $otherParticipant->user;
                        $conversation->title = $otherUser->first_name . ' ' . $otherUser->last_name;
                    }
                }
                
                return $conversation;
            });
        
        return Inertia::render('Messages/Index', [
            'conversations' => $conversations,
            'currentConversation' => $conversation
        ]);
    }

    /**
     * Store a new message in the conversation.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function storeMessage(Request $request, $id)
    {
        $request->validate([
            'content' => 'required|string',
            'media' => 'nullable|json'
        ]);
        
        $user = Auth::user();
        
        // Check if the user is a participant in this conversation
        $participant = ConversationParticipant::where('conversationId', $id)
            ->where('userId', $user->user_id)
            ->first();
        
        if (!$participant) {
            abort(403, 'You are not a participant in this conversation');
        }
        
        // Create the message
        $message = Message::create([
            'content' => $request->content,
            'media' => $request->media,
            'senderId' => $user->user_id,
            'conversationId' => $id
        ]);
        
        // Update the conversation's last activity time
        $conversation = Conversation::find($id);
        $conversation->updatedAt = now();
        $conversation->save();
        
        // Mark as read by the sender
        ReadReceipt::create([
            'messageId' => $message->message_id,
            'userId' => $user->user_id
        ]);
        
        // Create notifications for other participants
        $otherParticipants = ConversationParticipant::where('conversationId', $id)
            ->where('userId', '!=', $user->user_id)
            ->get();
        
        foreach ($otherParticipants as $otherParticipant) {
            // Create notification
            Notification::create([
                'userId' => $otherParticipant->userId,
                'type' => 'MESSAGE',
                'title' => 'New Message',
                'content' => $user->first_name . ' ' . $user->last_name . ' sent you a message',
                'data' => json_encode([
                    'conversationId' => $id,
                    'messageId' => $message->message_id
                ])
            ]);
            
            // Set recipient for direct messages
            if (!$conversation->isGroup && count($otherParticipants) === 1) {
                $message->recipientId = $otherParticipant->userId;
                $message->save();
            }
            
            // Broadcast event
            broadcast(new NewMessage($message, $otherParticipant->userId))->toOthers();
        }
        
        return redirect()->back();
    }

    /**
     * Create a new conversation with another user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function createConversation(Request $request)
    {
        $request->validate([
            'recipientId' => 'required|string|exists:users,user_id',
            'message' => 'required|string'
        ]);
        
        $user = Auth::user();
        $recipientId = $request->recipientId;
        
        // Check if a conversation already exists between these users
        $existingConversation = Conversation::whereHas('participants', function ($query) use ($user) {
                $query->where('userId', $user->user_id);
            })
            ->whereHas('participants', function ($query) use ($recipientId) {
                $query->where('userId', $recipientId);
            })
            ->where('isGroup', false)
            ->first();
        
        if ($existingConversation) {
            // Add message to existing conversation
            $message = Message::create([
                'content' => $request->message,
                'senderId' => $user->user_id,
                'recipientId' => $recipientId,
                'conversationId' => $existingConversation->id
            ]);
            
            // Update conversation timestamp
            $existingConversation->updatedAt = now();
            $existingConversation->save();
            
            // Mark as read by the sender
            ReadReceipt::create([
                'messageId' => $message->message_id,
                'userId' => $user->user_id
            ]);
            
            // Create notification for recipient
            Notification::create([
                'userId' => $recipientId,
                'type' => 'MESSAGE',
                'title' => 'New Message',
                'content' => $user->first_name . ' ' . $user->last_name . ' sent you a message',
                'data' => json_encode([
                    'conversationId' => $existingConversation->id,
                    'messageId' => $message->message_id
                ])
            ]);
            
            // Broadcast event
            broadcast(new NewMessage($message, $recipientId))->toOthers();
            
            return redirect()->route('messages.show', $existingConversation->id);
        }
        
        // Create a new conversation
        $conversation = Conversation::create([
            'isGroup' => false
        ]);
        
        // Add participants
        ConversationParticipant::create([
            'conversationId' => $conversation->id,
            'userId' => $user->user_id
        ]);
        
        ConversationParticipant::create([
            'conversationId' => $conversation->id,
            'userId' => $recipientId
        ]);
        
        // Add the first message
        $message = Message::create([
            'content' => $request->message,
            'senderId' => $user->user_id,
            'recipientId' => $recipientId,
            'conversationId' => $conversation->id
        ]);
        
        // Mark as read by the sender
        ReadReceipt::create([
            'messageId' => $message->message_id,
            'userId' => $user->user_id
        ]);
        
        // Create notification for recipient
        Notification::create([
            'userId' => $recipientId,
            'type' => 'MESSAGE',
            'title' => 'New Message',
            'content' => $user->first_name . ' ' . $user->last_name . ' sent you a message',
            'data' => json_encode([
                'conversationId' => $conversation->id,
                'messageId' => $message->message_id
            ])
        ]);
        
        // Broadcast event
        broadcast(new NewMessage($message, $recipientId))->toOthers();
        
        return redirect()->route('messages.show', $conversation->id);
    }

    /**
     * Get unread message count for the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUnreadCount()
    {
        $user = Auth::user();
        
        $unreadCount = Message::whereHas('conversation.participants', function ($query) use ($user) {
                $query->where('userId', $user->user_id);
            })
            ->where('senderId', '!=', $user->user_id)
            ->whereDoesntHave('readBy', function ($query) use ($user) {
                $query->where('userId', $user->user_id);
            })
            ->count();
        
        return response()->json(['unreadCount' => $unreadCount]);
    }

    /**
     * Get recent notifications for the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getNotifications()
    {
        $user = Auth::user();
        
        $notifications = Notification::where('userId', $user->user_id)
            ->orderBy('createdAt', 'desc')
            ->limit(10)
            ->get();
        
        return response()->json(['notifications' => $notifications]);
    }

    /**
     * Mark a notification as read.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function markNotificationAsRead(Request $request)
    {
        $request->validate([
            'notificationId' => 'required|string|exists:notifications,id'
        ]);
        
        $user = Auth::user();
        
        $notification = Notification::where('id', $request->notificationId)
            ->where('userId', $user->user_id)
            ->first();
        
        if ($notification) {
            $notification->isRead = true;
            $notification->readAt = now();
            $notification->save();
            
            return response()->json(['success' => true]);
        }
        
        return response()->json(['success' => false], 404);
    }
}