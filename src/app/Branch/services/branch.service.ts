import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IBranchDTO } from '../Interfaces/model';
import { APIResponse } from '../../AllModel/api-response';

//import { APIResponse } from '../../AllModel/api-response';
import { IBranchCreateDTO, IBranchResponseData } from '../Interfaces/ibranch-get';

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  private apiUrl = 'http://localhost:5050/api/Branch/all';
  constructor(private http: HttpClient) {}

  getAllBranchesEmp(): Observable<IBranchDTO[]> {
    
    
    
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.data.branches.filter((branch: IBranchDTO) => !branch.isDeleted))
    );
  }
  

 
  getAllBranches():Observable<APIResponse<IBranchResponseData>>{
    return this.http.get<APIResponse<IBranchResponseData>>(this.apiUrl);
  }

  getBranchById(id:number):Observable<APIResponse<IBranchResponseData>>{
    return this.http.get<APIResponse<IBranchResponseData>>(this.apiUrl);
  }
  // checkBranchExistence(branchData: IBranchCreateDTO): Observable<boolean> {
  //   return this.http.post<boolean>(`${this.baseURL}/check-existence`, branchData);
  // }
  checkBranchExistence(branchData: IBranchCreateDTO): Observable<{ exists: boolean, type: string }> {
    return this.http.post<{ exists: boolean, type: string }>(`${this.apiUrl}`, branchData);
  }
  
}


 




 





