import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IRoleDTO } from '../Interfaces/roles.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private rolesUrl = 'http://localhost:5050/api/Role';

  constructor(private http: HttpClient) {}

  getAllRoles(): Observable<IRoleDTO[]> {
    return this.http.get<IRoleDTO[]>(this.rolesUrl);
  }
}