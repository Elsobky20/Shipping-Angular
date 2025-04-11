import { Component, OnInit } from '@angular/core';
import { ShowDeliveryDto } from '../../Interfaces/delivery.model';
import { DeliveryService } from '../../services/delivery.service';
import { CommonModule } from '@angular/common';
import{HttpReqService} from '../../../GeneralSrevices/http-req.service';
@Component({
  selector: 'app-all-delivery',
  templateUrl: './all-delivery.component.html',
  styleUrls: ['./all-delivery.component.css'],
  imports: [CommonModule]
})
export class AllDeliveryComponent implements OnInit {
  constructor(private cityService:DeliveryService, private httpReqervice:HttpReqService){}
 
   deliveries!:ShowDeliveryDto[];
 
   ngOnInit(): void {
     this.httpReqervice.getAll('Delivery','all').subscribe({
       next: (response) => {
        console.log(response); 
         this.deliveries = response;
         console.log(this.deliveries);
       },
       error: (error) => {
         console.log(error);
       }
     })
   }
  }
