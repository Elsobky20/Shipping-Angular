// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-government-form',
//   imports: [],
//   templateUrl: './government-form.component.html',
//   styleUrl: './government-form.component.css'
// })
// export class GovernmentFormComponent {

// }
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-government-form',
  templateUrl: './government-form.component.html',
  styleUrls: ['./government-form.component.css']
})
export class GovernmentFormComponent implements OnInit {
  governmentForm!: FormGroup;
  governmentId: string | null = null;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.governmentForm = this.fb.group({
      name: ['', Validators.required],
      status: ['Active', Validators.required],
      branchId: [null, Validators.required]
    });

    this.route.paramMap.subscribe(params => {
      this.governmentId = params.get('id');

      if (this.governmentId && this.governmentId !== '0') {
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
    if (this.governmentForm.invalid) return;

    const formData = this.governmentForm.value;

    if (this.isEditMode) {
      // Call update API
      console.log('Updating government:', formData);
    } else {
      // Call create API
      console.log('Creating new government:', formData);
    }
  }
}
