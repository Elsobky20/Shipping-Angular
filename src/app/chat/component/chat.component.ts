import { Component } from '@angular/core';
import { ChatService } from '../services/ChatService';
import { ChatMessageDTO } from '../services/ChatService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  senderId: string = '';
  content: string = '';
  messages: any[] = [];

  constructor(private chatService: ChatService) {}

  sendMessage(): void {
    // التحقق من صحة المدخلات
    if (!this.senderId || !this.content.trim()) {
      alert('Please provide senderId and message content!');
      console.log('Please provide senderId and message content!');
      return;
    }

    const message: ChatMessageDTO = {
      senderId: this.senderId,
      content: this.content,
      timestamp: new Date().toISOString()
    };

    // إرسال الرسالة إلى الـ API
    console.log('Sending message: ', message);

    this.chatService.sendMessage(message).subscribe(
      (response) => {
        console.log('Message sent successfully:', response);

        // إضافة الرسالة التي تم إرسالها إلى الرسائل المعروضة
        this.messages.push({
          senderId: message.senderId,
          content: message.content,
          timestamp: message.timestamp
        });

        // التحقق من الرد من الـ bot
        if (response && response.botReply) {
          this.messages.push({
            senderId: 'bot',
            content: response.botReply.content,
            timestamp: response.botReply.timestamp
          });
          console.log('Bot reply received:', response.botReply);
        }

        // مسح محتوى الرسالة بعد الإرسال
        this.content = '';
      },
      (error) => {
        console.error('Error sending message', error);
      }
    );
  }

  loadMessages(): void {
    // جلب الرسائل بناءً على senderId
    if (!this.senderId) {
      console.error('No senderId provided to load messages.');
      return;
    }

    this.chatService.getMessagesBySender(this.senderId).subscribe(
      (messages) => {
        console.log('Messages loaded:', messages);
        this.messages = messages;
      },
      (error) => {
        console.error('Error fetching messages', error);
      }
    );
  }
}
