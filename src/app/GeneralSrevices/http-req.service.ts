import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICityCreateDTO, ICityEditDTO } from '../City/Interfaces/icity-get';

@Injectable({
  providedIn: 'root'
})
export class HttpReqService {
  baseUrl:string = "http://localhost:5050/api";
  constructor(private http:HttpClient) { }
  /* ===================== Start GetAll Method By Pagination =================== */
  getAll(endPoint:string, allOrExist:string,options: {
    searchTxt?: string;
    page?: number;
    pageSize?: number
  } = {}): Observable<any> {
    // تعيين القيم الافتراضية
    const {
      searchTxt,
      page = 1,
      pageSize = 10
    } = options;

    // بناء query parameters باستخدام HttpParams
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())

    // إضافة المعاملات الاختيارية إذا كانت موجودة
    if (searchTxt) params = params.set('searchTxt', searchTxt);

    return this.http.get<any>(`${this.baseUrl}/${endPoint}/${allOrExist}`, { params });
  }
  /* ===================== End GetAll Method By Pagination ===================== */

  /* ===================== Start GetById Method ================================ */
  getById(endPoint:string, id:number):Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${endPoint}/${id}`);
  }
  /* ===================== End GetById Method ================================== */

  /* ===================== Start Create Method ================================= */
  create(endPoint:string, iCityCreateDTO:ICityCreateDTO):Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${endPoint}`, iCityCreateDTO);
  }
  /* ===================== End Create Method =================================== */

  /* ===================== Start Edit Method =================================== */
  editById(endPoint:string, id:number, iCityEditDTO:ICityEditDTO):Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${endPoint}/${id}`, iCityEditDTO);
  }
  /* ===================== End Edit Method ===================================== */

  /* ===================== Start SoftDelete Method ============================= */
  softDelete(endPoint:string, id:number):Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${endPoint}/${id}`);
  }
  /* ===================== End SoftDelete Method =============================== */
}
