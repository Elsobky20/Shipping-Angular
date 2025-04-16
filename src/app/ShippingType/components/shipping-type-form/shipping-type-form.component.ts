import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICreateShippingTypeDTO } from '../../Interfaces/ICreateShippingTypeDTO';
import { ShippingTypeService } from '../../services/shipping-type.service';
import { IShippingTypeDTO } from '../../Interfaces/IShippingTypeDTO';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-shipping-type-form',
  standalone: true, 
  imports: [FormsModule, CommonModule],
  templateUrl: './shipping-type-form.component.html',
  styleUrls: ['./shipping-type-form.component.css']
})
export class ShippingTypeFormComponent implements OnInit {
  shippingType: ICreateShippingTypeDTO = { type: '', description: '', cost: 0 };
  isEditMode: boolean = false;
  shippingTypeId: number | null = null;
  errorMessage: string = '';
  formErrors: { [key: string]: string } = { Type: '', Cost: '' }; // لتخزين رسايل الخطأ

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private shippingTypeService: ShippingTypeService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.shippingTypeId = +id;
      this.loadShippingType(this.shippingTypeId);
    }
  }

  loadShippingType(id: number): void {
    this.shippingTypeService.getShippingTypeById(id).subscribe({
      next: (data: IShippingTypeDTO) => {
        this.shippingType = {
          type: data.type,
          description: data.description,
          cost: data.cost
        };
      },
      error: (err) => {
        this.errorMessage = 'Error fetching shipping type';
        console.error(err);
      }
    });
  }

  validateField(field: string): void {
    this.formErrors[field] = '';
    if (field === 'Type' && !this.shippingType.type) {
      this.formErrors['Type'] = 'Type is required';
    }
    if (field === 'Cost') {
      if (this.shippingType.cost === null || this.shippingType.cost === undefined) {
        this.formErrors['Cost'] = 'Cost is required';
      } else if (this.shippingType.cost <= 0) {
        this.formErrors['Cost'] = 'Cost must be greater than 0';
      }
    }
  }

  saveShippingType(): void {

    this.validateField('Type');
    this.validateField('Cost');

    if (Object.values(this.formErrors).some(error => error !== '')) {
      this.errorMessage = 'Please fix the errors in the form';
      return;
    }

    if (this.isEditMode && this.shippingTypeId) {
      const updatedShippingType: IShippingTypeDTO = {
        id: this.shippingTypeId,
        type: this.shippingType.type,
        description: this.shippingType.description,
        cost: this.shippingType.cost,
        isDeleted: false
      };
      this.shippingTypeService.updateShippingType(this.shippingTypeId, updatedShippingType).subscribe({
        next: () => {
          alert('Shipping type updated successfully');
          this.router.navigate(['/shipping-types']);
        },
        error: (err) => {
          this.errorMessage = 'Error updating shipping type';
          console.error(err);
        }
      });
    } else {
      this.shippingTypeService.createShippingType(this.shippingType).subscribe({
        next: () => {
          alert('Shipping type created successfully');
          this.router.navigate(['/shipping-types']);
        },
        error: (err) => {
          this.errorMessage = 'Error creating shipping type';
          console.error(err);
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/shipping-types']);
  }
}