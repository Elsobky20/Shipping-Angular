import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpReqService } from '../../../GeneralSrevices/http-req.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { RouterModule, Router, ActivatedRoute, RouterLink } from '@angular/router';
import { BranchService } from '../../services/branch.service';
import { IBranchCreateDTO } from '../../Interfaces/ibranch-get';

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
  mode: 'add' | 'edit' = 'add';
  loading = false;

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
    this.http.getById('Branch', id).subscribe({
      next: (data: IBranchCreateDTO) => {
        this.branchForm.patchValue(data);
      },
      error: err => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to load branch data.',
        });
      }
    });
  }

  async onSubmit(): Promise<void> {
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

    try {
      // Check if branch name, mobile, and location combination already exists
      const isBranchExist = await this.branchService.checkBranchExistence(branchData).toPromise();

      if (isBranchExist && isBranchExist.exists) {
        // Handle different types of duplicates based on the 'type' field
        if (isBranchExist.type === 'all') {
          Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'A branch with the same name, mobile, and location already exists.',
          });
        } else if (isBranchExist.type === 'mobile') {
          Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'This mobile number is already registered with another branch.',
          });
        } else if (isBranchExist.type === 'name') {
          Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'Branch name already exists.',
          });
        } else if (isBranchExist.type === 'location') {
          Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'Branch location already exists.',
          });
        }
        return;
      }

      // If editing, update the branch
      if (this.isEdit && this.branchId) {
        // Update existing branch
        this.http.editById('Branch', this.branchId, branchData).subscribe({
          next: res => {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Branch updated successfully!',
              confirmButtonText: 'OK'
            });
            this.router.navigate(['/branches']);
          },
          error: err => {
            console.error(err);
            Swal.fire({
              icon: 'error',
              title: 'Failed!',
              text: 'Something went wrong while updating the branch.',
              confirmButtonText: 'OK'
            });
          }
        });
      } else {
        // If creating, add a new branch
        this.http.create('Branch', branchData).subscribe({
          next: res => {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Branch added successfully!',
              confirmButtonText: 'OK'
            });
            this.branchForm.reset();
          },
          error: err => {
            console.log(err);
            Swal.fire({
              icon: 'error',
              title: 'Failed!',
              text: 'Something went wrong while adding the branch.',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an issue validating the data.',
      });
    } finally {
      this.loading = false;
    }
  }

  // Move these functions above 'onSubmit'
  isInvalid(control: string): boolean {
    const c = this.branchForm.get(control);
    return c ? c.invalid && (c.dirty || c.touched) : false;
  }

  fc(control: string) {
    return this.branchForm.get(control);
  }
}
