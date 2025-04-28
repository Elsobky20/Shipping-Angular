import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WieghPriceService {
  baseUrl:string = "http://localhost:5050/api/WeightPricing";
  constructor(private http:HttpClient){}

  edit(dto:object):Observable<any>{
    return this.http.put<any>(`${this.baseUrl}`, dto)
  }
}
