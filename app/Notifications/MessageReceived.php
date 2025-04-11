<?php

namespace App\Notifications;

use App\Models\Message;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MessageReceived extends Notification implements ShouldQueue
{
    use Queueable;

    protected $message;

    /**
     * Create a new notification instance.
     *
     * @param  \App\Models\Message  $message
     * @return void
     */
    public function __construct(Message $message)
    {
        $this->message = $message;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $sender = $this->message->sender;
        $senderName = $sender->first_name . ' ' . $sender->last_name;
        
        return (new MailMessage)
            ->subject('New Message from ' . $senderName)
            ->greeting('Hello ' . $notifiable->first_name . '!')
            ->line('You have received a new message from ' . $senderName . ':')
            ->line('"' . $this->message->content . '"')
            ->action('View Message', url('/messages/' . $this->message->conversationId))
            ->line('Thank you for using Trompo!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        $sender = $this->message->sender;
        
        return [
            'message_id' => $this->message->message_id,
            'conversation_id' => $this->message->conversationId,
            'sender_id' => $sender->user_id,
            'sender_name' => $sender->first_name . ' ' . $sender->last_name,
            'content' => $this->message->content,
            'timestamp' => $this->message->timestamp
        ];
    }
}