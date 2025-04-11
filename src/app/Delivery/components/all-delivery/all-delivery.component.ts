import { Component, OnInit } from '@angular/core';
import { ShowDeliveryDto } from '../../Interfaces/delivery.model';
import { DeliveryService } from '../../services/delivery.service';
import { CommonModule } from '@angular/common';
import{HttpReqService} from '../../../GeneralSrevices/http-req.service';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-all-delivery',
  templateUrl: './all-delivery.component.html',
  styleUrls: ['./all-delivery.component.css'],
  imports: [CommonModule, RouterModule]
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

   selectedValue: string = '10';
     values: number[] = [5, 10, 20];
     selectValue(val: number) {
       this.selectedValue = val.toString();
     }
   
     deleteDelivery(id:number): void{
       const delivery = this.deliveries.find(c => c.id === id);
       if (delivery?.isDeleted) {
         Swal.fire({
           title: "Can't delete Delivery.",
           text: 'This Delivery is already deleted!',
           icon: 'error',
           confirmButtonText: 'Ok'
         });
         return;
       }
       // تأكيد الحذف للمدينة النشطة
       this.httpReqervice.confirmAndDelete('Delivery', id).subscribe({
         next: (response) => {
           // عند نجاح الحذف
           Swal.fire({
             title: 'Deleted successfully!',
             text: 'Delivery deleted successfully!',
             icon: 'success',
             confirmButtonText: 'Ok'
           });
           
           const index = this.deliveries.findIndex(c => c.id === id);
           if (index !== -1) {
             // 2. إنشاء نسخة جديدة من المصفوفة
             this.deliveries = [...this.deliveries];
             this.deliveries[index].isDeleted = true;
             this.deliveries;
           }
         },
         error: (error) => {
           console.log(error);
           Swal.fire({
             title: 'Error!',
             text: 'Failed deleting Delivery.',
             icon: 'error',
             confirmButtonText: 'Ok'
           });
         }
       });
     }
  }
