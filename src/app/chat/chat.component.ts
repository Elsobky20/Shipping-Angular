import { Component, ElementRef, ViewChild, AfterViewChecked } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ChatService, ChatMessage } from "../../core/services/chat.service";
import { AuthService } from "../../core/services/auth.service";
import { Role } from "../../core/models/role.enum";

@Component({
  selector: "app-chat",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-container" *ngIf="isAdmin">
      <div class="chat-icon" [class.active]="isChatOpen" (click)="toggleChat()">
        <i class="bi bi-chat-dots-fill"></i>
      </div>

      <div class="chat-window" [class.open]="isChatOpen">
        <div class="chat-header">
          <h3>Mimo</h3>
          <button class="close-btn" (click)="toggleChat()">
            <i class="bi bi-x"></i>
          </button>
        </div>

        <div class="chat-body" #chatBody>
          <div *ngFor="let message of messages" class="message" [class.user-message]="message.sender === 'user'" [class.mimo-message]="message.sender === 'mimo'">
            <div class="message-content">
              <p>{{ message.content }}</p>
              <span class="timestamp">{{ message.timestamp | date:'shortTime' }}</span>
            </div>
          </div>
        </div>

        <div class="chat-footer">
          <input
            type="text"
            [(ngModel)]="newMessage"
            (keyup.enter)="sendMessage()"
            placeholder="Type your message..."
          />
          <button (click)="sendMessage()" [disabled]="!newMessage.trim()">
            <i class="bi bi-send"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chat-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
    }

    .chat-icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #007bff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      transition: transform 0.3s ease;
    }

    .chat-icon:hover {
      transform: scale(1.1);
    }

    .chat-icon i {
      color: white;
      font-size: 24px;
    }

    .chat-window {
      position: fixed;
      bottom: 80px;
      right: 20px;
      width: 320px;
      height: 450px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      visibility: hidden;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
    }

    .chat-window.open {
      visibility: visible;
      opacity: 1;
      transform: translateY(0);
    }

    .chat-header {
      padding: 15px;
      background: #007bff;
      color: white;
      border-radius: 12px 12px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .chat-header h3 {
      margin: 0;
      font-size: 18px;
    }

    .close-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 20px;
    }

    .chat-body {
      flex: 1;
      padding: 15px;
      overflow-y: auto;
    }

    .message {
      margin-bottom: 15px;
      display: flex;
      flex-direction: column;
    }

    .message-content {
      max-width: 80%;
      padding: 10px 15px;
      border-radius: 15px;
      position: relative;
    }

    .user-message {
      align-items: flex-end;
    }

    .mimo-message {
      align-items: flex-start;
    }

    .user-message .message-content {
      background: #007bff;
      color: white;
    }

    .mimo-message .message-content {
      background: #f0f2f5;
      color: #1c1e21;
    }

    .timestamp {
      font-size: 11px;
      opacity: 0.7;
      margin-top: 5px;
    }

    .chat-footer {
      padding: 15px;
      border-top: 1px solid #eee;
      display: flex;
      gap: 10px;
    }

    .chat-footer input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 20px;
      outline: none;
    }

    .chat-footer button {
      background: #007bff;
      color: white;
      border: none;
      border-radius: 50%;
      width: 35px;
      height: 35px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chat-footer button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  `]
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('chatBody') private chatBody!: ElementRef;

  isAdmin = false;
  isChatOpen = false;
  newMessage = '';
  messages: ChatMessage[] = [];

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.isAdmin = user?.roleId === Role.ADMIN;
    });

    this.chatService.messages$.subscribe(messages => {
      this.messages = messages;
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  async sendMessage() {
    if (!this.newMessage.trim()) return;

    await this.chatService.sendMessageToAI(this.newMessage);
    this.newMessage = '';
  }

  private scrollToBottom(): void {
    try {
      this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
    } catch (err) {}
  }
}