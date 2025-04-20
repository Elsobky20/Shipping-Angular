import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  baseUrl:string = "http://localhost:5050/api/order";
  constructor(private http:HttpClient) { }


  /* ===================== Start GetAllByEmployee Method By Pagination =================== */
  getAllOrdersByEmployee(
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
  /* ===================== End GetAllByEmployee Method By Pagination ===================== */


  /* ===================== Start GetAllByMerchant Method By Pagination =================== */
  getAllOrdersByMerchant(
    id:number,
    orderStatus: string = "New",
    allOrExist: string,
    filters: {
      searchTxt?: string;
      governId?: number;
      cityId?: number;
      branchId?: number;
      startDate?: string; // ISO string format
      endDate?: string;   // ISO string format
      page?: number;
      pageSize?: number;
    } = {}
  ): Observable<any> {
    const {
      searchTxt,
      governId,
      cityId,
      branchId,
      startDate,
      endDate,
      page = 1,
      pageSize = 10
    } = filters;

    let params = new HttpParams()
    .set('page', page.toString())
    .set('pageSize', pageSize.toString());

    if (searchTxt) params = params.set('searchTxt', searchTxt);
    if (governId) params = params.set('governId', governId.toString());
    if (cityId) params = params.set('cityId', cityId.toString());
    if (branchId) params = params.set('serialNum', branchId);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<any>(
      `${this.baseUrl}/Merchant/${id}/${orderStatus}/${allOrExist}`,
      { params }
    );
  }
  /* ===================== End GetAllByMerchant Method By Pagination ===================== */


  /* ===================== Start GetAllByMerchant Method By Pagination =================== */
  getAllOrdersByDelivery(
    id:number,
    orderStatus: string = "DeliveredToAgent",
    allOrExist: string,
    filters: {
      searchTxt?: string;
      governId?: number;
      cityId?: number;
      serialNum?: string;
      startDate?: string; // ISO string format
      endDate?: string;   // ISO string format
      page?: number;
      pageSize?: number;
    } = {}
  ): Observable<any> {
    const {
      searchTxt,
      governId,
      cityId,
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
    if (governId) params = params.set('governId', governId.toString());
    if (cityId) params = params.set('cityId', cityId.toString());
    if (serialNum) params = params.set('serialNum', serialNum);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<any>(
      `${this.baseUrl}/Delivery/${id}/${orderStatus}/${allOrExist}`,
      { params }
    );
  }
  /* ===================== End GetAllByMerchant Method By Pagination ===================== */


  /* ===================== Start Delete Method =========================================== */
  deleteOrRejectOrder(orderId: number, userId: string): Observable<any> {
    return this.http.delete<Observable<any>>(`${this.baseUrl}/${orderId}`, {
      params: {
        userId: userId
      }
    });
  }
  /* ===================== End Delete Method ============================================ */


  /* ===================== Start Update Status Method =================================== */
  changeOrderStatus(orderId: number, userId: string, newStatus: string, note: string): Observable<any> {
    const url = `${this.baseUrl}/${orderId}/${userId}/${newStatus}?note=${encodeURIComponent(note)}`;
    return this.http.put<Observable<any>>(url, {});
  }
  /* ===================== End Update Status Method ===================================== */


  /* ===================== Start Assign Order To Delivery Method ======================= */
  assignOrderToDelivery(orderId: number, deliveryId: number): Observable<any> {
    return this.http.put<Observable<any>>(`${this.baseUrl}/${orderId}/${deliveryId}`, {}); // ممكن تزود Headers أو Body لو محتاج
  }
  /* ===================== End Assign Order To Delivery Method ======================== */


  /* ===================== Start Get Exist Governments Method ========================= */
  getExistingGovernments():Observable<any> {
    return this.http.get<Observable<any>>(`http://localhost:5050/api/government/exist`, {
      params: {
        pageSize:10000
      }
    });
  }
  /* ===================== End Get Exist Governments Method ========================== */


  /* ===================== Start Get Exist Cities Method ============================= */
  getExistingCities():Observable<any> {
    return this.http.get<Observable<any>>(`http://localhost:5050/api/city/exist`, {
      params: {
        pageSize:10000
      }
    });
  }
  /* ===================== End Get Exist Cities Method =============================== */


  /* ===================== Start Get Shipping Type Method ============================ */
  getExistingShippingTypes():Observable<any> {
    return this.http.get<Observable<any>>(`http://localhost:5050/api/shippingType/exist`);
  }
  /* ===================== End Get Shipping Type Method ============================== */


  /* ===================== Start Get Branches Method ================================= */
  getExistingBranches():Observable<any> {
    return this.http.get<Observable<any>>(`http://localhost:5050/api/branch/exist`, {
      params: {
        pageSize:10000
      }
    });
  }
  /* ===================== Start Get User Method ================================ */
  getUserByRole(id: string, role: string): Observable<any> {
    const params = new HttpParams().set('Role', role);
    return this.http.get<Observable<any>>(`http://localhost:5050/api/user/${id}`, { params });
  }
  /* ===================== Start Order Reports Method ================================ */
  getOrderReports(
    searchTxt?: string,
    startDate?: string,
    endDate?: string,
    orderStatus: string = 'New',
    page: number = 1,
    pageSize: number = 10
  ): Observable<any> {
    let params = new HttpParams()
      .set('orderStatus', orderStatus)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (searchTxt) params = params.set('searchTxt', searchTxt);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<Observable<any>>(`http://localhost:5050/api/orderReport`, { params });
  }
  /* ===================== End Order Reports Method ================================== */


  /* ===================== Start Order's Count Method ================================== */
  getOrdersCountByStatus(role: string = '', id: number | null, orderStatus: string = 'New'): Observable<any> {
    const params = new HttpParams()
    .set('role', role)
    .set('id', id !== null ? id.toString() : '');

    return this.http.get<any>(`${this.baseUrl}/${orderStatus}`, { params });
  }
  /* ===================== End Order's Count Method ==================================== */
}

