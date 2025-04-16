import { Component } from '@angular/core';
import { ChatService } from '../services/ChatService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
imports:[CommonModule,FormsModule],
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  userMessage: string = '';
  messages: { sender: string, text: string }[] = [];

  constructor(private chatService: ChatService) {}

  sendMessage() {
    if (!this.userMessage.trim()) return;

    this.messages.push({ sender: 'user', text: this.userMessage });

    this.chatService.sendMessage(this.userMessage).subscribe(response => {
      this.messages.push({ sender: 'bot', text: response.reply });
    });

    this.userMessage = '';
  }
}
