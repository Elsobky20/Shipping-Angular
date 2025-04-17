import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpReqService } from '../../../GeneralSrevices/http-req.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { RouterModule, Router, ActivatedRoute, RouterLink } from '@angular/router';
import { BranchService } from '../../services/branch.service';
import { IBranchCreateDTO} from '../../Interfaces/ibranch-get';


@Component({
  selector: 'app-branch-form',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, RouterLink],
  templateUrl: './branch-form.component.html',
  styleUrl: './branch-form.component.css'
})

  export class BranchFormComponent implements OnInit {
      branchForm!: FormGroup;
      isEdit: boolean = false;
      branchId: number | null = null;
      loading = false;
      submitted = false; // Track form submission attempt
      
      constructor(
        private fb: FormBuilder,
        private http: HttpReqService,
        private router: Router,
        private branchService: BranchService,
        private route: ActivatedRoute
      ) {}
    
      ngOnInit(): void {
        this.initForm();
    
        // Check for existing branch id in the route for editing
        this.route.paramMap.subscribe(params => {
          const id = params.get('id');
          if (id) {
            this.isEdit = true;
            this.branchId = +id;
            console.log('Edit mode activated for branch ID:', this.branchId);
            this.loadBranch(this.branchId);
          }
        });
      }
    
      initForm(): void {
        this.branchForm = this.fb.group({
          name: ['', [Validators.required, Validators.maxLength(100)]],
          mobile: ['', [Validators.required, this.mobileValidator()]],
          location: ['', [Validators.required, Validators.maxLength(200)]]
        });
      }
    
      // Custom mobile number validation (same as backend regex)
      mobileValidator() {
        return (control: any) => {
          if (!control.value) return { required: true }; // Return required error if empty
          const mobileRegex = /^(010|011|012|015)\d{8}$/;
          const landlineRegex = /^0\d{9}$/;
          if (mobileRegex.test(control.value) || landlineRegex.test(control.value)) {
            return null;
          } else {
            return { invalidMobile: true };
          }
        };
      }
    
      loadBranch(id: number): void {
        this.loading = true;
        console.log('Fetching branch data for ID:', id);
        
        this.http.getById('Branch', id).subscribe({
          next: (data: any) => {
            console.log('Branch data received:', data);
            
            // Check if data is wrapped in a response object
            const branchData = data.data || data;
            
            if (!branchData) {
              console.error('No branch data found in the response');
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'No branch data found.',
              });
              this.loading = false;
              return;
            }
            
            // Ensure we have the expected properties
            if (!branchData.name && !branchData.mobile && !branchData.location) {
              console.error('Branch data is missing expected properties:', branchData);
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Branch data is incomplete or in an unexpected format.',
              });
              this.loading = false;
              return;
            }
            
            // Update the form with the branch data
            this.branchForm.patchValue({
              name: branchData.name || '',
              mobile: branchData.mobile || '',
              location: branchData.location || ''
            });
            
            console.log('Form updated with branch data');
            this.loading = false;
          },
          error: err => {
            console.error('Error fetching branch data:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to load branch data. Please try again.',
            });
            this.loading = false;
          }
        });
      }
    
      async onSubmit(): Promise<void> {
        this.submitted = true; // Mark form as submitted to show all validation errors
        
        // Mark all fields as touched to trigger validation messages
        Object.keys(this.branchForm.controls).forEach(key => {
          const control = this.branchForm.get(key);
          control?.markAsTouched();
          control?.markAsDirty();
          control?.updateValueAndValidity();
        });
        
        console.log('Form validation status:', this.branchForm.valid);
        console.log('Form values:', this.branchForm.value);
        console.log('Form errors:', this.getFormValidationErrors());
        
        if (this.branchForm.invalid) {
          Swal.fire({
            icon: 'warning',
            title: 'Validation Error',
            text: 'Please fill all required fields correctly.',
          });
          return;
        }
    
        this.loading = true;
        const branchData = this.branchForm.value;
        console.log('Submitting branch data:', branchData, 'isEdit:', this.isEdit);
    
        try {
          // Check if branch already exists (only for new branches)
          if (!this.isEdit) {
            try {
              const isBranchExist = await this.branchService.checkBranchExistence(branchData).toPromise();
              
              if (isBranchExist && isBranchExist.exists) {
                let errorMessage = 'This branch already exists.';
                
                // Handle different types of duplicates
                if (isBranchExist.type === 'all') {
                  errorMessage = 'A branch with the same name, mobile, and location already exists.';
                } else if (isBranchExist.type === 'mobile') {
                  errorMessage = 'This mobile number is already registered with another branch.';
                } else if (isBranchExist.type === 'name') {
                  errorMessage = 'Branch name already exists.';
                } else if (isBranchExist.type === 'location') {
                  errorMessage = 'Branch location already exists.';
                }
                
                Swal.fire({
                  icon: 'error',
                  title: 'Validation Error',
                  text: errorMessage,
                });
                
                this.loading = false;
                return;
              }
            } catch (checkError) {
              console.error('Error checking branch existence:', checkError);
              // Continue with submission even if check fails
            }
          }
    
          // Perform the API call based on whether we're editing or creating
          if (this.isEdit && this.branchId) {
            console.log('Updating branch with ID:', this.branchId);
            this.http.editById('Branch', this.branchId, branchData).subscribe({
              next: (res) => {
                console.log('Branch updated successfully:', res);
                Swal.fire({
                  icon: 'success',
                  title: 'Success!',
                  text: res?.message || 'Branch updated successfully!',
                  confirmButtonText: 'OK'
                }).then(() => {
                  this.router.navigate(['/branch']);
                });
              },
              error: (err) => {
                console.error('Error updating branch:', err);
                Swal.fire({
                  icon: 'error',
                  title: 'Failed!',
                  text: err?.error?.message || 'Something went wrong while updating the branch.',
                  confirmButtonText: 'OK'
                });
                this.loading = false;
              },
              complete: () => {
                this.loading = false;
              }
            });
          } else {
            console.log('Creating new branch');
            this.http.create('Branch', branchData).subscribe({
              next: (res) => {
                console.log('Branch created successfully:', res);
                Swal.fire({
                  icon: 'success',
                  title: 'Success!',
                  text: res?.message || 'Branch added successfully!',
                  confirmButtonText: 'OK'
                }).then(() => {
                  this.router.navigate(['/branch']);
                });
              },
              error: (err) => {
                console.error('Error creating branch:', err);
                Swal.fire({
                  icon: 'error',
                  title: 'Failed!',
                  text: err?.error?.message || 'Something went wrong while adding the branch.',
                  confirmButtonText: 'OK'
                });
                this.loading = false;
              },
              complete: () => {
                this.loading = false;
              }
            });
          }
        } catch (err) {
          console.error('General error in form submission:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an issue processing your request.',
          });
          this.loading = false;
        }
      }
    
      // Helper method to get all validation errors for debugging
      getFormValidationErrors() {
        const errors: any = {};
        Object.keys(this.branchForm.controls).forEach(key => {
          const control = this.branchForm.get(key);
          if (control && control.errors) {
            errors[key] = control.errors;
          }
        });
        return errors;
      }
    
      // Get form control
      fc(control: string) {
        return this.branchForm.get(control);
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
        
        if (controlInstance.errors['maxlength']) {
          const maxLength = controlInstance.errors['maxlength'].requiredLength;
          return `Maximum length is ${maxLength} characters.`;
        }
        
        if (controlInstance.errors['invalidMobile']) {
          return 'Please enter a valid mobile number (e.g., 01012345678) or landline (e.g., 0123456789).';
        }
        
        return 'Invalid input.';
      }
    }