import { Component, OnInit } from '@angular/core';
import { ShippingTypeService } from '../../services/shipping-type.service';
import { IShippingTypeDTO } from '../../Interfaces/IShippingTypeDTO';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-shipping-type-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shipping-type-list.component.html',
  styleUrls: ['./shipping-type-list.component.css']
})
export class ShippingTypeListComponent implements OnInit {
  shippingTypes: IShippingTypeDTO[] = [];
  showDeleted: boolean = false;
  errorMessage: string = '';
  noDataMessage: string = '';

  constructor(private shippingTypeService: ShippingTypeService) {}

  ngOnInit(): void {
    this.loadShippingTypes();
  }

  loadShippingTypes(): void {
    this.errorMessage = '';
    this.noDataMessage = '';
    this.shippingTypes = []; // تأكد إن الـ Array فاضي قبل ما تجيب الداتا

    const method = this.showDeleted
      ? this.shippingTypeService.getAllShippingTypes()
      : this.shippingTypeService.getAllExistShippingTypes();

    method.subscribe({
      next: (data) => {
        console.log('Data from Backend:', data);
        // تأكد إن data هو Array، لو مش Array حوله لArray فاضي
        this.shippingTypes = Array.isArray(data) ? data : [];
        console.log('shippingTypes after assignment:', this.shippingTypes); // أضف Console Log للتأكد

        if (this.shippingTypes.length === 0) {
          this.noDataMessage = 'No shipping types available.';
        }
      },
      error: (err) => {
        this.errorMessage = 'Failed to load shipping types. Please try again later.';
        console.error('Error fetching shipping types:', err);
      }
    });
  }

  toggleDeleted(): void {
    this.showDeleted = !this.showDeleted;
    this.loadShippingTypes();
  }

  deleteShippingType(id: number): void {
    if (confirm('Are you sure you want to delete this shipping type?')) {
      this.shippingTypeService.deleteShippingType(id).subscribe({
        next: (message: string) => {
          alert(message);
          this.loadShippingTypes();
        },
        error: (err) => {
          this.errorMessage = 'Error deleting shipping type';
          console.error('Error deleting shipping type:', err);
        }
      });
    }
  }
}