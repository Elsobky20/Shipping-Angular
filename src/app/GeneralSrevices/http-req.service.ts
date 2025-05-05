import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

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
  getById(endPoint:string, id:any):Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${endPoint}/${id}`);
  }
  /* ===================== End GetById Method ================================== */

  /* ===================== Start Create Method ================================= */
  create(endPoint:any, Dto:object):Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${endPoint}`, Dto);
  }
  /* ===================== End Create Method =================================== */

  /* ===================== Start Edit Method =================================== */
  editById(endPoint:string, id:number | string, Dto:object):Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${endPoint}/${id}`, Dto);
  }
  /* ===================== End Edit Method ===================================== */

  /* ===================== Start SoftDelete Method ============================= */
  confirmAndDelete(
    endPoint: string,
    id: number | string,
  ): Observable<any> {
    return new Observable((observer) => {
      Swal.fire({
        title: 'Are You Sure?',
        text: "You can't back again!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Delete!',
        cancelButtonText: 'Cancle'
      }).then((result) => {
        if (result.isConfirmed) {
          this.http.delete(`${this.baseUrl}/${endPoint}/${id}`).subscribe({
            next: (response) => {

              Swal.fire('Deleted Successfully!', '', 'success');
              observer.next(response);  // إرسال استجابة النجاح
              observer.complete();      // إكمال الـ Observable
            },
            error: (err) => {
              Swal.fire('Failed!', 'Failed Deleting', 'error');
              observer.error(err);
            }
          });
        } else {
          observer.complete();
        }
      });
    });
  }
  /* ===================== End SoftDelete Method =============================== */
}
