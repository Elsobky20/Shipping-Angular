import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRoleDTO } from '../Interfaces/roles.model'; // أضف الـ import ده

export interface RolePermissionDTO {
  permission_Id: string;
  role_Id: string;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canAdd: boolean;
  isDeleted: boolean;
}

export interface AppRoleDTO {
  id: string;
  name: string;
  isDeleted: boolean;
  rolePermissions: RolePermissionDTO[];
}
@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private apiUrl = 'http://localhost:5050/api/Role';
  constructor(private http: HttpClient) { }
  getRoles(includeDeleted: boolean = true): Observable<AppRoleDTO[]> {
    let params = new HttpParams().set('includeDelted', includeDeleted);
    return this.http.get<AppRoleDTO[]>(`${this.apiUrl}`, { params });
}

getAllRoles(): Observable<IRoleDTO[]> {
  return this.http.get<IRoleDTO[]>(this.apiUrl);
}



}