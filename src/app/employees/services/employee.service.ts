import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';  
import { Observable } from 'rxjs';
import { IEmployeeDTO } from '../Interfaces/IEmployeeDTO';
import { ICreateEmployeeDTO } from '../Interfaces/ICreateEmployeeDTO';
import { IGenericPagination } from '../Interfaces/IGenericPagination';
import { IUpdateEmployeeDTO } from '../Interfaces/IUpdateEmployeeDTO';
import { map } from 'rxjs/operators';


import { IBranchDTO } from '../../Branch/Interfaces/model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl = 'http://localhost:5050/api/Employee'; 
  private apiUrl = 'http://localhost:5050/api/Branch';


  constructor(private http: HttpClient) {}

  // Get all employees
  getAllEmployees(includeDeleted: boolean = true, pageIndex: number = 1, pageSize: number = 10): Observable<IGenericPagination<IEmployeeDTO>> {
   
    console.log (`${includeDeleted}  from serv`)
   
    const params = new HttpParams()
      .set('includeDeleted', includeDeleted.toString())
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<IGenericPagination<IEmployeeDTO>>(this.baseUrl, {
      params,
      headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
    });
  }
  // Get employee by ID
  getEmployeeById(id: number): Observable<IEmployeeDTO> {
    return this.http.get<IEmployeeDTO>(`${this.baseUrl}/${id}`);
  }

  // Create new employee
  createEmployee(employee: ICreateEmployeeDTO): Observable<void> {
    return this.http.post<void>(this.baseUrl, employee);
  }

  // Update existing employee
  updateEmployee(id: number, employee: IUpdateEmployeeDTO): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, employee);
  }

  // Delete employee
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Search by name
  searchByName(term: string): Observable<IEmployeeDTO[]> {
    const params = new HttpParams().set('term', term);
    return this.http.get<IEmployeeDTO[]>(`${this.baseUrl}/SearchByName`, { params });
  }

  // Get employees by role
  getEmployeesByRole(roleName: string): Observable<IEmployeeDTO[]> {
    const params = new HttpParams().set('roleName', roleName);
    return this.http.get<IEmployeeDTO[]>(`${this.baseUrl}/GetEmployeesByRole`, { params });
  }

  //
 getAllBranchesEmp(): Observable<IBranchDTO[]> {
    
    
    
    return this.http.get<any>(`${this.apiUrl}/all`).pipe(
      map(response => response.data.branches.filter((branch: IBranchDTO) => !branch.isDeleted))
    );
  }
  
  
}
