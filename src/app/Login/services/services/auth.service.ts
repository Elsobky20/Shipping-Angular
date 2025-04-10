import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5050/api/Account'; // تأكد من المسار الصحيح للـ API

  constructor(private http: HttpClient) {}

  // دالة تسجيل الدخول
  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(`${this.apiUrl}`, body, { responseType: 'text' as 'json' }); // تأكد من صحة المسار في الـ API
  }

  // دالة لجلب التوكين من الـ localStorage
  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // دالة لتضمين التوكين في الـ Headers للطلبات اللاحقة
  getHeaders() {
    const token = this.getAuthToken();
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }
    return new HttpHeaders();
  }

  // دالة للحصول على بيانات محمية باستخدام التوكين
  getProtectedData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/protected`, {
      headers: this.getHeaders()  // تضمين التوكين في الـ Headers
    });
  }
}
