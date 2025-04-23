import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";

export interface ChatMessage {
  content: string;
  sender: "user" | "mimo";
  timestamp: Date;
}

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private messages = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messages.asObservable();

  constructor(private http: HttpClient) {}

  addMessage(content: string, sender: "user" | "mimo"): void {
    const newMessage: ChatMessage = {
      content,
      sender,
      timestamp: new Date(),
    };
    const currentMessages = this.messages.value;
    this.messages.next([...currentMessages, newMessage]);
  }

  async sendMessageToAI(message: string): Promise<void> {
    this.addMessage(message, "user");
    try {
      const response = await this.http
        .post<{ reply: string }>(`${environment.apiUrl}/api/chat`, { message })
        .toPromise();
      if (response?.reply) {
        this.addMessage(response.reply, "mimo");
      }
    } catch (error) {
      console.error("Error sending message to AI:", error);
      this.addMessage("Sorry, I couldn't process your message. Please try again.", "mimo");
    }
  }

  clearMessages(): void {
    this.messages.next([]);
  }
}