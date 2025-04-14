import { Component, OnInit } from '@angular/core';
import { HttpReqService } from '../../../GeneralSrevices/http-req.service'
@Component({
  selector: 'app-weightpricing-list',
  templateUrl: './weightpricing-list.component.html',
  styleUrls: ['./weightpricing-list.component.css']
})
export class WeightpricingListComponent implements OnInit {

  weightPricings: any[] = [];

  constructor(private httpService: HttpReqService) { }

  ngOnInit(): void {
  }

  createWeightPricing(): void {
    const newWeight = {
      weight: 5,
      price: 50
    };
  
    this.httpService.create('WeightPricing', newWeight).subscribe({
      next: (res) => {
        console.log('Created successfully', res);
        // ممكن تعرض SweetAlert أو تعيد تحميل البيانات
      },
      error: (err) => {
        console.error('Create failed', err);
      }
    });
  }

  updateWeightPricing(): void {
    const updatedWeight = {
      id: 1,
      weight: 7,
      price: 70
    };
  
    this.httpService.editById('WeightPricing', updatedWeight.id, updatedWeight).subscribe({
      next: (res) => {
        console.log('Updated successfully', res);
      },
      error: (err) => {
        console.error('Update failed', err);
      }
    });
  }
}
