
 import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { APIResponse } from '../AllModel/api-response';
import { IRejectReasonResponseData } from './ireject-reason';



@Injectable({
  providedIn: 'root'
})
export class RejectReassonserviceService {

  constructor(private http:HttpClient) { }

  baseURL:string = "http://localhost:5050/api/RejectReason/all";
  getAllRejectReasons():Observable<APIResponse<IRejectReasonResponseData>>{
    return this.http.get<APIResponse<IRejectReasonResponseData>>(this.baseURL);
  }

  getRejecrReasonById(id:number):Observable<APIResponse<IRejectReasonResponseData>>{
    return this.http.get<APIResponse<IRejectReasonResponseData>>(this.baseURL);
  }
}
