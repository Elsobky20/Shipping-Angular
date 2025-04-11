import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
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
  constructor(private cityService:DeliveryService, private httpReqervice:HttpReqService,private cdr: ChangeDetectorRef){}
 
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
       // تأكيد الحذف  
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
          console.log(index);
           if (index !== -1) {
            this.deliveries.splice(index, 1); // حذف العنصر من المصفوفة
        
        // إعادة تعيين المصفوفة لتحديث واجهة المستخدم
        this.deliveries = [...this.deliveries];
        this.cdr.detectChanges();  // تحديث الـ UI
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
