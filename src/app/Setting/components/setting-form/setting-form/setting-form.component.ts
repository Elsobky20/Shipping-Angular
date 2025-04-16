import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpReqService } from '../../../../GeneralSrevices/http-req.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { ISettingCreateDTOS } from '../../../Interfaces/isetting-get';

import { ActivatedRoute, Router ,RouterModule} from '@angular/router';
@Component({
  selector: 'app-setting-form',
  imports: [CommonModule,ReactiveFormsModule, FormsModule,RouterModule],
  templateUrl: './setting-form.component.html',
  styleUrl: './setting-form.component.css'
})
export class SettingFormComponent implements OnInit {

  settingForm!: FormGroup;
  isEdit: boolean = false;
  settingId: number | null = null;
  loading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpReqService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEdit = true;
        this.settingId = +id;
        console.log('Edit mode activated for setting ID:', this.settingId);
        this.loadSetting(this.settingId);
      }
    });
  }

  initForm(): void {
    this.settingForm = this.fb.group({
      shippingToVillageCost: [null, [Validators.required, Validators.min(0)]],
      deliveryAutoAccept: [null, Validators.required]
    });
  }

  loadSetting(id: number): void {
    this.loading = true;
    console.log('Fetching setting data for ID:', id);
    
    this.http.getById('Setting', id).subscribe({
      next: (data: any) => {
        console.log('Setting data received:', data);
        
        // Check if data is wrapped in a response object
        const settingData = data.data || data;
        
        if (!settingData) {
          console.error('No setting data found in the response');
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'No setting data found.',
          });
          this.loading = false;
          return;
        }
        
        // Update the form with the setting data
        this.settingForm.patchValue({
          shippingToVillageCost: settingData.shippingToVillageCost,
          deliveryAutoAccept: settingData.deliveryAutoAccept
        });
        
        console.log('Form updated with setting data');
        this.loading = false;
      },
      error: err => {
        console.error('Error fetching setting data:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to load setting data. Please try again.',
        });
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    
    // Mark all fields as touched to trigger validation messages
    Object.keys(this.settingForm.controls).forEach(key => {
      const control = this.settingForm.get(key);
      control?.markAsTouched();
      control?.markAsDirty();
      control?.updateValueAndValidity();
    });
    
    console.log('Form validation status:', this.settingForm.valid);
    console.log('Form values:', this.settingForm.value);
    console.log('Form errors:', this.getFormValidationErrors());
    
    if (this.settingForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill all required fields correctly.',
      });
      return;
    }

    this.loading = true;
    const settingData = this.settingForm.value;
    console.log('Submitting setting data:', settingData, 'isEdit:', this.isEdit);

    if (this.isEdit && this.settingId) {
      console.log('Updating setting with ID:', this.settingId);
      // Update existing setting
      this.http.editById('Setting', this.settingId, settingData).subscribe({
        next: (res) => {
          console.log('Setting updated successfully:', res);
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: res?.message || 'Setting updated successfully!',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/settings']);
          });
        },
        error: (err) => {
          console.error('Error updating setting:', err);
          Swal.fire({
            icon: 'error',
            title: 'Failed!',
            text: err?.error?.message || 'Something went wrong while updating setting.',
            confirmButtonText: 'OK'
          });
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      console.log('Creating new setting');
      // Create new setting
      this.http.create('Setting', settingData).subscribe({
        next: (res) => {
          console.log('Setting created successfully:', res);
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: res?.message || 'Setting added successfully!',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/settings']);
          });
        },
        error: (err) => {
          console.error('Error creating setting:', err);
          Swal.fire({
            icon: 'error',
            title: 'Failed!',
            text: err?.error?.message || 'Something went wrong while adding setting. Setting may already exist.',
            confirmButtonText: 'OK'
          });
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  // Helper method to get all validation errors for debugging
  getFormValidationErrors() {
    const errors: any = {};
    Object.keys(this.settingForm.controls).forEach(key => {
      const control = this.settingForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  // Get form control
  fc(control: string) {
    return this.settingForm.get(control);
  }
  
  // Check if control is invalid and should show error
  isInvalid(control: string): boolean {
    const controlInstance = this.fc(control);
    return !!controlInstance && 
           (controlInstance.invalid && 
           (controlInstance.touched || controlInstance.dirty || this.submitted));
  }
  
  // Get specific error message for a control
  getErrorMessage(control: string): string {
    const controlInstance = this.fc(control);
    if (!controlInstance || !controlInstance.errors) return '';
    
    if (controlInstance.errors['required']) {
      return 'This field is required.';
    }
    
    if (controlInstance.errors['min']) {
      const min = controlInstance.errors['min'].min;
      return `Value must be at least ${min}.`;
    }
    
    return 'Invalid input.';
  }
}