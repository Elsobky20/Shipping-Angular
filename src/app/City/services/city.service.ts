import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ICityResponseData } from '../Interfaces/ICity';
import { APIResponse } from '../../aModels/api-response';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  constructor(private http:HttpClient) { }

  baseURL:string = "http://localhost:5050/api/City/all";
  getAllCities():Observable<APIResponse<ICityResponseData>>{
    return this.http.get<APIResponse<ICityResponseData>>(this.baseURL);
  }
}
