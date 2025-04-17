import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateRolePermissionDTO, RolePermissionDTO, UpdateRolePermissionDTO } from '../models/models';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RolePermissionService {
  private baseUrl = 'http://localhost:5050/api/RolePermission'; // عدلها حسب عنوان API عندك

  constructor(private http: HttpClient) { }

  getAll(includeDeleted: boolean = true): Observable<RolePermissionDTO[]> {
    console.log(`getAll - Fetching role permissions with includeDeleted: ${includeDeleted}`);
    return this.http.get<RolePermissionDTO[]>(`${this.baseUrl}/All?includeDelted=${includeDeleted}`).pipe(
      tap((data:RolePermissionDTO[]) => {
        console.log('Data fetched from API:', data);
      })
    );
  }
  

  getById(roleId: string, permissionId: number): Observable<RolePermissionDTO> {
    return this.http.get<RolePermissionDTO>(`${this.baseUrl}/${roleId}/${permissionId}`);
  }

  create(roleId: string, permissionId: number, dto: CreateRolePermissionDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/${roleId}/${permissionId}`, dto);
  }

  update(roleId: string, permissionId: number, dto: UpdateRolePermissionDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}/${roleId}/${permissionId}`, dto);
  }

  delete(roleId: string, permissionId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${roleId}/${permissionId}`);
  }
}
