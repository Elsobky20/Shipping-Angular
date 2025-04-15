import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICreateShippingTypeDTO } from '../Interfaces/ICreateShippingTypeDTO';
import { IShippingTypeDTO } from '../Interfaces/IShippingTypeDTO';
@Injectable({
  providedIn: 'root'
})
export class ShippingTypeService {
  private readonly apiUrl = 'http://localhost:5050/api/shippingtype';

  constructor(private http: HttpClient) { }

  createShippingType(shippingType: ICreateShippingTypeDTO): Observable<string> {
    return this.http.post(this.apiUrl, shippingType, { responseType: 'text' }) as Observable<string>;
  }

  getAllShippingTypes(): Observable<IShippingTypeDTO[]> {
    return this.http.get<IShippingTypeDTO[]>(`${this.apiUrl}/All`);
  }

  getAllExistShippingTypes(): Observable<IShippingTypeDTO[]> {
    return this.http.get<IShippingTypeDTO[]>(`${this.apiUrl}/exist`);
  }

  getShippingTypeById(id: number): Observable<IShippingTypeDTO> {
    return this.http.get<IShippingTypeDTO>(`${this.apiUrl}/${id}`);
  }

  updateShippingType(id: number, shippingType: IShippingTypeDTO): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, shippingType, { responseType: 'text' }) as Observable<string>;
  }

  deleteShippingType(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' }) as Observable<string>;
  }
}