import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PermissionDTO, CreatePermissionDTO } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private apiUrl = 'http://localhost:5050/api/Permissions';

  constructor(private http: HttpClient) {}

  // Get all permissions
  getPermissions(): Observable<PermissionDTO[]> {
    return this.http.get<PermissionDTO[]>(`${this.apiUrl}/Exist`);
  }
  getPermissionById(id:number): Observable<PermissionDTO> {
    return this.http.get<PermissionDTO>(`${this.apiUrl}/${id}`);
  }
  // Create a new permission
  createPermission(permission: CreatePermissionDTO): Observable<PermissionDTO> {
    return this.http.post<PermissionDTO>(this.apiUrl, permission);
  }

  // Update an existing permission
  updatePermission(id: number, permission: CreatePermissionDTO): Observable<PermissionDTO> {
    return this.http.put<PermissionDTO>(`${this.apiUrl}/${id}`, permission);
  }

  // Delete a permission
  deletePermission(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
