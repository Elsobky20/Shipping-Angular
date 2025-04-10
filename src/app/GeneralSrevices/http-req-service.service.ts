import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpReqServiceService {
  baseUrl:string = "http://localhost:5050/api";
  constructor(private http:HttpClient) { }

  getWithPagination(options: {
    searchTxt?: string;
    all?: string;
    page?: number;
    pageSize?: number
  } = {}): Observable<any> {
    // تعيين القيم الافتراضية
    const {
      searchTxt,
      all = 'all',
      page = 1,
      pageSize = 10
    } = options;

    // بناء query parameters باستخدام HttpParams
    let params = new HttpParams()
      .set('all', all)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())

    // إضافة المعاملات الاختيارية إذا كانت موجودة
    if (searchTxt) params = params.set('searchTxt', searchTxt);

    return this.http.get<any>(`${this.baseUrl}/`, { params });
  }
}
