import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppRoleDTO, CreateRoleDTO, UpdateRoleDTO, RolePermissionDTO } from '../Interfaces/Role';
import {IRoleDTO} from '../Interfaces/roles.model'
@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = 'http://localhost:5050/api/Role';

  constructor(private http: HttpClient) {}

  getRoles(): Observable<AppRoleDTO[]> {
    return this.http.get<AppRoleDTO[]>(`${this.apiUrl}`);
  }

  getRoleById(id: string): Observable<AppRoleDTO> {
    return this.http.get<AppRoleDTO>(`${this.apiUrl}/${id}`);
  }

  addRole(role: CreateRoleDTO): Observable<AppRoleDTO> {
    return this.http.post<AppRoleDTO>(this.apiUrl, role);
  }

  updateRole(id: string, role: UpdateRoleDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, role);
  }

  deleteRole(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  assignRole(userId: string, roleName: string): Observable<any> {
    const params = new HttpParams()
      .set('UserId', userId)
      .set('RoleName', roleName);
    return this.http.post(`${this.apiUrl}/AssignRole`, {}, { params });
  }


  getAllRoles(): Observable<IRoleDTO[]> {
    return this.http.get<IRoleDTO[]>(this.apiUrl);
  }


}