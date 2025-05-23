import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpReqService } from '../../../GeneralSrevices/http-req.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-delivery',
  templateUrl: './add-delivery.component.html',
  styleUrls: ['./add-delivery.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class AddDeliveryComponent implements OnInit {
  mode: 'add' | 'edit' | 'details' = 'add';
  deliveryId?: number;
  deliveryForm!: FormGroup;
  branches: any[] = [];
  governments: any[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpReqService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadBranches();
  
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.deliveryId = +id;
  
        // لو الرابط فيه كلمة "details" هنخلي المود details
        if (this.router.url.includes('details')) {
          this.mode = 'details';
        } else {
          this.mode = 'edit';
        }
  
        this.loadDeliveryData(this.deliveryId);
  
        // لو details اعملي disable لكل الفيلدات بعد تحميل البيانات
        if (this.mode === 'details') {
          this.deliveryForm.disable();
        }
      }
    });
  }
  

  getGovernmentsNames(ids: number[]): string[] {
    return this.governments
      .filter(g => ids.includes(g.id))
      .map(g => g.name);
  }


  

  initForm(): void {
    this.deliveryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^(?:\+20|0)?1[0-2,5]{1}[0-9]{8}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', Validators.required],
      branchId: ['', Validators.required],
      governmentsId: [[], Validators.required],
      discountType: ['', Validators.required],
      companyPercentage: ['', Validators.required]
    });
  }

  loadDeliveryData(id: number): void {
    this.loading = true;
    this.http.getById('Delivery', id).subscribe({
      next: (delivery) => {
        console.log(delivery);
        // تعيين البيانات بناءً على الاستجابة من الـ API
        this.deliveryForm.patchValue({
          name: delivery.name,
          email: delivery.email,
          phone: delivery.phone,
          address: delivery.address,
          branchId: delivery.branchName,  // تعيين اسم الفرع
          governmentsId: delivery.governmentName,  // تعيين الأسماء بدلاً من المعرفات
          discountType: delivery.discountType,
          companyPercentage: delivery.companyPercentage
        });
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Failed to load delivery data', 'error');
        this.loading = false;
      }
    });
  }
  
  

  loadBranches(): void {
    this.http.getAll('Branch', 'all').subscribe({
      next: (res) => {
        this.branches = res.data.branches.sort((a: { name: string }, b: { name: string }) => 
          a.name.localeCompare(b.name));
      },
      error: (err) => {
        console.error(err);
      }
    });
    
  }

  onBranchChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedBranchId = Number(target.value);
  
    if (selectedBranchId) {
      this.http.getById('Delivery/GovernmentByBranch', selectedBranchId).subscribe({
        next: (data) => {
          this.governments = data;
          console.log('Governments:', this.governments);
        },
        error: (err) => {
          console.log('Error:', err?.message || err);
        }
      });
    }
  }

  getBranchName(id: number): string {
    const branch = this.branches.find(b => b.id === id);
    return branch ? branch.name : '';
  }

  onSubmit(): void {
    if (this.deliveryForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill all required fields correctly.',
      });
      return;
    }

    this.loading = true;
    const deliveryData = this.deliveryForm.value;

    const request = this.mode === 'add' 
      ? this.http.create('Delivery', deliveryData)
      : this.http.editById('Delivery', this.deliveryId!, deliveryData);

    request.subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: res?.message || `Delivery ${this.mode === 'add' ? 'added' : 'updated'} successfully!`,
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/deliveries']);
        });
      },
      error: (err) => {
        console.error('Error:', err);
        const errorMessage = err?.error?.message || 
          `Something went wrong while ${this.mode === 'add' ? 'adding' : 'updating'} delivery.`;
        
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: errorMessage,
          confirmButtonText: 'OK'
        });
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  // Helper methods for form validation
  fc = (control: string) => this.deliveryForm.get(control);
  
  isInvalid = (control: string): boolean => {
    const controlInstance = this.fc(control);
    return controlInstance ? 
      controlInstance.invalid && (controlInstance.touched || controlInstance.dirty) : 
      false;
  };
}