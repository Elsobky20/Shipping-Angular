

// }
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-regect-reasonform',
  imports: [],
  templateUrl: './regect-reasonform.component.html',
  styleUrl: './regect-reasonform.component.css'
})
export class  RegectReasonformComponent implements OnInit {
  rejectReasonForm!: FormGroup;
  rejectReasonId: string | null = null;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.rejectReasonForm = this.fb.group({
      rejectReason: ['', Validators.required],
      // status: ['Active', Validators.required],
      // branchId: [null, Validators.required]
    });

    this.route.paramMap.subscribe(params => {
      this.rejectReasonId = params.get('id');

      if (this.rejectReasonId && this.rejectReasonId !== '0') {
        this.isEditMode = true;
        // هنا المفروض تجيبي البيانات من API أو service
        // مثال:
        // this.governmentService.getById(this.governmentId).subscribe(data => {
        //   this.governmentForm.patchValue(data);
        // });
      }
    });
  }

  onSubmit() {
    if (this.rejectReasonForm.invalid) return;

    const formData = this.rejectReasonForm.value;

    if (this.isEditMode) {
      // Call update API
      console.log('Updating rejectReason:', formData);
    } else {
      // Call create API
      console.log('Creating new reajectReason:', formData);
    }
  }
}
