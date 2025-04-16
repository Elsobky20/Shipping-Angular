import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserOrderService {
  private baseUrl = 'http://localhost:5050/api/Order/Delivery'; // لا تنسي تعديل URL بناءً على الـ API الخاص بك
  private apiUrl='http://localhost:5050/api/';
  constructor(private http: HttpClient) {}

  getOrdersByDelivery(
    filters: {
      deliveryId: number;
      orderStatus: string; // سيقبل "New", "Processed", إلخ
      allOrExist: string; // سيقبل "all" أو "exist"
      search?: string;
      page?: number;
      pageSize?: number;
    }
  ): Observable<any> {
    const {
      deliveryId,
      orderStatus,
      allOrExist,
      search = '',
      page = 1,
      pageSize = 10
    } = filters;

    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (search) {
      params = params.set('search', search);
    }
    const url = `${this.apiUrl}Order/Delivery/${deliveryId}/${orderStatus}/${allOrExist}`;
    return this.http.get(url, { params });
  }
  getUserId(id: string, role: string): Observable<any> {
    const url = `${this.apiUrl}User/${id}?Role=${role}`;
    return this.http.get<any>(url);
  }
}
