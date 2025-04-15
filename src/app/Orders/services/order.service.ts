import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  baseUrl:string = "http://localhost:5050/api/order";
  constructor(private http:HttpClient) { }
  /* ===================== Start GetAll Method By Pagination =================== */
  getAllOrders(
    orderStatus: string = "New",
    allOrExist: string,
    filters: {
      searchTxt?: string;
      branchId?: number;
      merchantId?: number;
      governId?: number;
      cityId?: number;
      deliveryId?: number;
      serialNum?: string;
      startDate?: string; // ISO string format
      endDate?: string;   // ISO string format
      page?: number;
      pageSize?: number;
    } = {}
  ): Observable<any> {
    const {
      searchTxt,
      branchId,
      merchantId,
      governId,
      cityId,
      deliveryId,
      serialNum,
      startDate,
      endDate,
      page = 1,
      pageSize = 10
    } = filters;

    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (searchTxt) params = params.set('searchTxt', searchTxt);
    if (branchId) params = params.set('branchId', branchId.toString());
    if (merchantId) params = params.set('merchantId', merchantId.toString());
    if (governId) params = params.set('governId', governId.toString());
    if (cityId) params = params.set('cityId', cityId.toString());
    if (deliveryId) params = params.set('deliveryId', deliveryId.toString());
    if (serialNum) params = params.set('serialNum', serialNum);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<any>(
      `${this.baseUrl}/${orderStatus}/${allOrExist}`,
      { params }
    );
  }
  /* ===================== Start Delete Method =================== */
  deleteOrRejectOrder(orderId: number, userId: string): Observable<any> {
    return this.http.delete<Observable<any>>(`${this.baseUrl}/${orderId}`, {
      params: {
        userId: userId
      }
    });
  }
}
