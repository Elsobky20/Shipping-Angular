import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiUrl = 'https://localhost:5001/api/chat'; // غيّر حسب API

  constructor(private http: HttpClient) {}

  sendMessage(message: string) {
    return this.http.post<any>(this.apiUrl, { text: message });
  }
}
