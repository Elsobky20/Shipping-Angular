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
  private apiUrl = 'http://localhost:5050/api/Branch';
  constructor(private http: HttpClient) {}

  // getAllBranchesEmp(): Observable<IBranchDTO[]> {
    
    
    
  //   return this.http.get<any>(`${this.apiUrl}/all`).pipe(
  //     map(response => response.data.branches.filter((branch: IBranchDTO) => !branch.isDeleted))
  //   );
  // }
  

 
  getAllBranches():Observable<APIResponse<IBranchResponseData>>{
    return this.http.get<APIResponse<IBranchResponseData>>(this.apiUrl);
  }

  getBranchById(id:number):Observable<APIResponse<IBranchResponseData>>{
    return this.http.get<APIResponse<IBranchResponseData>>(`${this.apiUrl}/${id}`);
  }
  // checkBranchExistence(branchData: IBranchCreateDTO): Observable<boolean> {
  //   return this.http.post<boolean>(`${this.baseURL}/check-existence`, branchData);
  // }
  checkBranchExistence(branchData: IBranchDTO): Observable<{ exists: boolean, type: string }> {
    return this.http.get<{ exists: boolean, type: string }>(`${this.apiUrl}}/check-existence`);
  }
  
}


 




 





