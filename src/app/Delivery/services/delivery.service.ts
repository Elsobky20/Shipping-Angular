import { Injectable } from '@angular/core';
import { HttpReqService } from '../../GeneralSrevices/http-req.service';
import { Observable } from 'rxjs';
import { ShowDeliveryDto } from '../Interfaces/delivery.model';
import { HttpClient } from '@angular/common/http';
import { APIResponse } from '../../AllModel/api-response';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  constructor(private http:HttpClient) { }

  baseURL:string = "http://localhost:5050/api/Delivery/all";
  getAllDelivery():Observable<APIResponse<ShowDeliveryDto>>{
    return this.http.get<APIResponse<ShowDeliveryDto>>(this.baseURL);
  }

  getDeliveryById(id:number):Observable<APIResponse<ShowDeliveryDto>>{
    return this.http.get<APIResponse<ShowDeliveryDto>>(this.baseURL);
  }
}