import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IBranchDTO } from '../Interfaces/model';

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  private apiUrl = 'http://localhost:5050/api/Branch/all';
  constructor(private http: HttpClient) {}

  getAllBranches(): Observable<IBranchDTO[]> {
    
    
    
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.data.branches.filter((branch: IBranchDTO) => !branch.isDeleted))
    );
  }
  
}