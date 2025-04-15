import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { APIResponse } from '../../AllModel/api-response';
import { IBranchCreateDTO, IBranchResponseData } from '../Interfaces/ibranch-get';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  constructor(private http:HttpClient) { }
  baseURL:string = "http://localhost:5050/api/Branch/all";
  getAllBranches():Observable<APIResponse<IBranchResponseData>>{
    return this.http.get<APIResponse<IBranchResponseData>>(this.baseURL);
  }

  getBranchById(id:number):Observable<APIResponse<IBranchResponseData>>{
    return this.http.get<APIResponse<IBranchResponseData>>(this.baseURL);
  }
  // checkBranchExistence(branchData: IBranchCreateDTO): Observable<boolean> {
  //   return this.http.post<boolean>(`${this.baseURL}/check-existence`, branchData);
  // }
  checkBranchExistence(branchData: IBranchCreateDTO): Observable<{ exists: boolean, type: string }> {
    return this.http.post<{ exists: boolean, type: string }>(`${this.baseURL}/check-existence`, branchData);
  }
  
}


 




