import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // بيخلي السيرفيس متاح في كل المشروع
})
export class RolePermissionService {
  private apiUrl = 'http://localhost:5050/api/RolePermission';

  constructor(private http: HttpClient) {}

  // دالة لإنشاء Role-Permission (مثلاً ربط رول ببيرميشن معين)
  createRolePermission(rolePermission: any): Observable<any> {
    return this.http.post(this.apiUrl, rolePermission);
  }

  // دالة لجلب كل الـ Role-Permissions
  getRolePermissions(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // دالة لجلب Role-Permission معين بناءً على ID
  getRolePermissionById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // دالة لتحديث Role-Permission
  updateRolePermission(id: number, rolePermission: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, rolePermission);
  }

  // دالة لحذف Role-Permission
  deleteRolePermission(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}