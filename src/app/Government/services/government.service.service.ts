import { Injectable } from '@angular/core';


import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { APIResponse } from '../../AllModel/api-response';
import { IGovernmentResponseData } from '../Interfaces/igovernment';

@Injectable({
  providedIn: 'root'
})
export class GovernmentServiceService {

  constructor(private http:HttpClient) { }

  baseURL:string = "http://localhost:5050/api/Government/all";
  getAllGovernments():Observable<APIResponse<IGovernmentResponseData>>{
    return this.http.get<APIResponse<IGovernmentResponseData>>(this.baseURL);
  }

  getGovernmentById(id:number):Observable<APIResponse<IGovernmentResponseData>>{
    return this.http.get<APIResponse<IGovernmentResponseData>>(this.baseURL);
  }
}

