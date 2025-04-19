import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatMessageDTO {
  senderId: string;
  content: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'https://localhost:5050/api/chat'; 

  constructor(private http: HttpClient) {}

  sendMessage(message: ChatMessageDTO): Observable<any> {
    return this.http.post(this.apiUrl, message, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getMessagesBySender(senderId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${senderId}`);
  }
}
