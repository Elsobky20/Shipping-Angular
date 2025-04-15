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

    const branchData: IBranchCreateDTO = this.branchForm.value;

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
            console.error(err);
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
    }
  }

  fc = (control: string) => this.branchForm.get(control);
  isInvalid = (control: string): boolean => {
    const controlInstance = this.fc(control);
    return controlInstance ? controlInstance.invalid && (controlInstance.touched || controlInstance.dirty) : false;
  };
}
  
  /////////////////////////////////////////////////////////////////////////////////////
//   branchForm!: FormGroup;

//   constructor(
//     private fb: FormBuilder,
//     private http: HttpReqService,
//     private router: Router,
//     private branchService: BranchService
//   ) {}

//   ngOnInit(): void {
//     this.initForm();
//   }

//   initForm(): void {
//     this.branchForm = this.fb.group({
//       name: ['', [Validators.required, Validators.maxLength(100)]],
//       mobile: ['', [Validators.required, this.mobileValidator()]],
//       location: ['', [Validators.required, Validators.maxLength(200)]]
//     });
//   }

//   // Custom mobile number validation (same as backend regex)
//   mobileValidator() {
//     return (control: any) => {
//       const mobileRegex = /^(010|011|012|015)\d{8}$/;
//       const landlineRegex = /^0\d{9}$/;
//       if (mobileRegex.test(control.value) || landlineRegex.test(control.value)) {
//         return null;
//       } else {
//         return { invalidMobile: true };
//       }
//     };
//   }

//   async onSubmit(): Promise<void> {
//     if (this.branchForm.invalid) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Validation Error',
//         text: 'Please fill all required fields correctly.',
//       });
//       return;
//     }

//     const branchData: IBranchCreateDTO = this.branchForm.value;

//     try {
//       // Check if branch name, mobile, and location combination already exists
//       const isBranchExist = await this.branchService.checkBranchExistence(branchData).toPromise();

//       // Ensure isBranchExist is not undefined
//       if (isBranchExist && isBranchExist.exists) {
//         // Handle different types of duplicates based on the 'type' field
//         if (isBranchExist.type === 'all') {
//           Swal.fire({
//             icon: 'error',
//             title: 'Validation Error',
//             text: 'A branch with the same name, mobile, and location already exists.',
//           });
//         } else if (isBranchExist.type === 'mobile') {
//           Swal.fire({
//             icon: 'error',
//             title: 'Validation Error',
//             text: 'This mobile number is already registered with another branch.',
//           });
//         } else if (isBranchExist.type === 'name') {
//           Swal.fire({
//             icon: 'error',
//             title: 'Validation Error',
//             text: 'Branch name already exists.',
//           });
//         } else if (isBranchExist.type === 'location') {
//           Swal.fire({
//             icon: 'error',
//             title: 'Validation Error',
//             text: 'Branch location already exists.',
//           });
//         }
//         return;
//       }

//       // Proceed with creating the branch if it doesn't exist
//       this.http.create('Branch', this.branchForm.value).subscribe({
//         next: res => {
//           Swal.fire({
//             icon: 'success',
//             title: 'Success!',
//             text: 'Branch added successfully!',
//             confirmButtonText: 'OK'
//           });
//           this.branchForm.reset();
//         },
//         error: err => {
//           console.error(err);
//           Swal.fire({
//             icon: 'error',
//             title: 'Failed!',
//             text: 'Something went wrong while adding branch.',
//             confirmButtonText: 'OK'
//           });
//         }
//       });
//     } catch (err) {
//       console.error(err);
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: 'There was an issue validating the data.',
//       });
//     }
//   }

//   fc = (control: string) => this.branchForm.get(control);
//   isInvalid = (control: string): boolean => {
//     const controlInstance = this.fc(control);
//     return controlInstance ? controlInstance.invalid && (controlInstance.touched || controlInstance.dirty) : false;
//   };
// }


//   branchForm!: FormGroup;

//   constructor(
//     private fb: FormBuilder,
//     private http: HttpReqService,
//     private router: Router,
//     private branchService: BranchService
//   ) {}

//   ngOnInit(): void {
//     this.initForm();
//   }

//   initForm(): void {
//     this.branchForm = this.fb.group({
//       name: ['', [Validators.required, Validators.maxLength(100)]],
//       mobile: ['', [Validators.required, this.mobileValidator()]],
//       location: ['', [Validators.required, Validators.maxLength(200)]]
//     });
//   }

//   // Custom mobile number validation (same as backend regex)
//   mobileValidator() {
//     return (control: any) => {
//       const mobileRegex = /^(010|011|012|015)\d{8}$/;
//       const landlineRegex = /^0\d{9}$/;
//       if (mobileRegex.test(control.value) || landlineRegex.test(control.value)) {
//         return null;
//       } else {
//         return { invalidMobile: true };
//       }
//     };
//   }

//   async onSubmit(): Promise<void> {
//     if (this.branchForm.invalid) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Validation Error',
//         text: 'Please fill all required fields correctly.',
//       });
//       return;
//     }

//     const branchData: IBranchCreateDTO = this.branchForm.value;

//     try {
//       // Check if branch name, mobile, and location combination already exists
//       const isBranchExist = await this.branchService.checkBranchExistence(branchData);
      
//       if (isBranchExist) {
//         Swal.fire({
//           icon: 'error',
//           title: 'Validation Error',
//           text: 'A branch with the same name, mobile, and location already exists.',
//         });
//         return;
//       }

//       // Proceed with creating the branch
//       this.http.create('Branch', this.branchForm.value).subscribe({
//         next: res => {
//           Swal.fire({
//             icon: 'success',
//             title: 'Success!',
//             text: 'Branch added successfully!',
//             confirmButtonText: 'OK'
//           });
//           this.branchForm.reset();
//         },
//         error: err => {
//           console.error(err);
//           Swal.fire({
//             icon: 'error',
//             title: 'Failed!',
//             text: 'Something went wrong while adding branch.',
//             confirmButtonText: 'OK'
//           });
//         }
//       });
//     } catch (err) {
//       console.error(err);
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: 'There was an issue validating the data.',
//       });
//     }
//   }

//   fc = (control: string) => this.branchForm.get(control);
//   isInvalid = (control: string): boolean => {
//     const controlInstance = this.fc(control);
//     return controlInstance ? controlInstance.invalid && (controlInstance.touched || controlInstance.dirty) : false;
//   };
// }


//   branchForm!: FormGroup;

//   constructor(private fb: FormBuilder, private http: HttpReqService, private router: Router) {}

//   ngOnInit(): void {
//     this.initForm();
//   }

//   initForm(): void {
//     this.branchForm = this.fb.group({
//          name: ['', Validators.required],
//          mobile: ['', Validators.required],
//          location: ['', Validators.required]
//     });
//     console.log(this.branchForm.value);
//   }

//   onSubmit(): void {
//     console.log(this.branchForm.value)
//     if (this.branchForm.invalid) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Validation Error',
//         text: 'Please fill all required fields correctly.',
//       });
//       return;
//     }

//     console.log('Form values:', this.branchForm.value); 

//     this.http.create('Branch', this.branchForm.value).subscribe({
//       next: res => {
//         Swal.fire({
//           icon: 'success',
//           title: 'Success!',
//           text: 'Branch added successfully!',
//           confirmButtonText: 'OK'
//         });
//         this.branchForm.reset();
//       },
//       error: err => {
//         console.error(err);
//         Swal.fire({
//           icon: 'error',
//           title: 'Failed!',
//           text: 'Something went wrong while adding branch.',
//           confirmButtonText: 'OK'
//         });
//       }
//     });
//   }

//   fc = (control: string) => this.branchForm.get(control);
//   isInvalid = (control: string): boolean => {
//     const controlInstance = this.fc(control);
//     return controlInstance ? controlInstance.invalid && (controlInstance.touched || controlInstance.dirty) : false;
//   };
// }




//   const payload: IBranchCreateDTO = {
//     name: this.getName.value || '',
//     mobile: this.getMobile.value || '',
//     location: this.getLocation.value || '',
//     isDeleted: !this.getIsDeleted.value
//   };

//   branchId!: number;

//   branchForm = new FormGroup({
//     name: new FormControl('', [Validators.required, Validators.minLength(3)]),
//     mobile: new FormControl('', [
//       Validators.required,
//       Validators.pattern(/^(010|011|012|015)\d{8}$|^0\d{9}$/)
//     ]),
//     location: new FormControl('', [Validators.required, Validators.minLength(3)]),
//     isDeleted: new FormControl(false)
//   });

//   constructor(
//     private httpReqService: HttpReqService,
//     private activatedRoute: ActivatedRoute,
//     private router: Router
//   ) {}

//   get getName() {
//     return this.branchForm.controls['name'];
//   }
//   get getMobile() {
//     return this.branchForm.controls['mobile'];
//   }
//   get getLocation() {
//     return this.branchForm.controls['location'];
//   }
//   get getIsDeleted() {
//     return this.branchForm.controls['isDeleted'];
//   }

//   ngOnInit(): void {
//     this.activatedRoute.paramMap.subscribe(params => {
//       this.branchId = Number(params.get('id'));

//       if (this.branchId !== 0) {
//         this.httpReqService.getById('branch', this.branchId).subscribe({
//           next: (res) => {
//             this.getName.setValue(res.data.name);
//             this.getMobile.setValue(res.data.mobile);
//             this.getLocation.setValue(res.data.location);
//             this.getIsDeleted.setValue(!res.data.isDeleted);
//           },
//           error: () => {}
//         });
//       }
//     });
//   }

//   branchHandler(): void {
//     if (this.branchForm.valid) {
//       const payload = {
//         ...this.branchForm.value,
//         isDeleted: !this.getIsDeleted.value
//       };

//       if (this.branchId === 0) {
//         this.httpReqService.create('branch', payload).subscribe({
//           next: () => {
//             Swal.fire({
//               icon: 'success',
//               title: 'Branch Added!',
//               confirmButtonColor: '#28a745'
//             });
//             this.router.navigate(['/branch']);
//           },
//           error: (err) => {
//             Swal.fire({
//               icon: 'error',
//               title: 'Error',
//               text: err?.error?.error || 'Unexpected error',
//               confirmButtonColor: '#dc3545'
//             });
//           }
//         });
//       } else {
//         this.httpReqService.editById('branch', this.branchId, payload).subscribe({
//           next: () => {
//             Swal.fire({
//               icon: 'success',
//               title: 'Branch Updated!',
//               confirmButtonColor: '#28a745'
//             });
//             this.router.navigate(['/branch']);
//           },
//           error: (err) => {
//             Swal.fire({
//               icon: 'error',
//               title: 'Error',
//               text: err?.error?.error || 'Unexpected error',
//               confirmButtonColor: '#dc3545'
//             });
//           }
//         });
//       }
//     }
//   }

//   cancelHandler(): void {
//     if (this.branchId === 0) {
//       this.branchForm.reset({
//         name: '',
//         mobile: '',
//         location: ''
//       });
//     } else {
//       this.router.navigate(['/branch']);
//     }
//   }
// }

//   branchId!: number;
//   isEditMode: boolean = false;

//   constructor(
//     private httpReqService: HttpReqService,
//     private activatedRoute: ActivatedRoute,
//     private router: Router
//   ) {}

//   form = new FormGroup({
//     name: new FormControl('', [Validators.required, Validators.minLength(3)]),
//     mobile: new FormControl('', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),
//     location: new FormControl('', [Validators.required]),
//     isDeleted: new FormControl(false)
//   });

//   get name() {
//     return this.form.controls['name'];
//   }
//   get mobile() {
//     return this.form.controls['mobile'];
//   }
//   get location() {
//     return this.form.controls['location'];
//   }
//   get isDeleted() {
//     return this.form.controls['isDeleted'];
//   }

//   ngOnInit(): void {
//     this.activatedRoute.paramMap.subscribe({
//       next: (params) => {
//         this.branchId = Number(params.get('id'));
//         this.isEditMode = this.branchId !== 0;

//         if (this.isEditMode) {
//           this.httpReqService.getById('branch', this.branchId).subscribe({
//             next: (response) => {
//               const data = response.data;
//               this.name.setValue(data.name);
//               this.mobile.setValue(data.mobile);
//               this.location.setValue(data.location);
//               this.isDeleted.setValue(!data.isDeleted);
//             },
//             error: (err) => console.error(err)
//           });
//         }
//       }
//     });
//   }

//   onSubmit(): void {
//     if (this.form.invalid) return;

//     const branchData = {
//       ...this.form.value,
//       isDeleted: !this.isDeleted.value
//     };

//     if (this.isEditMode) {
//       this.httpReqService.editById('branch', this.branchId, branchData).subscribe({
//         next: () => {
//           Swal.fire({
//             icon: 'success',
//             title: 'Branch Updated!',
//             text: `"${this.name.value}" has been updated successfully.`,
//             confirmButtonColor: '#28a745'
//           });
//           this.router.navigate(['/branch']);
//         },
//         error: (error) => {
//           this.handleError(error);
//         }
//       });
//     } else {
//       this.httpReqService.create('branch', branchData).subscribe({
//         next: () => {
//           Swal.fire({
//             icon: 'success',
//             title: 'Branch Added!',
//             text: `"${this.name.value}" has been added successfully.`,
//             confirmButtonColor: '#28a745'
//           });
//           this.router.navigate(['/branch']);
//         },
//         error: (error) => {
//           this.handleError(error);
//         }
//       });
//     }
//   }

//   handleError(error: any) {
//     if (error.error?.error === 'Branch is already exist.') {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Duplicate Branch',
//         text: `The branch "${this.name.value}" already exists.`,
//         confirmButtonColor: '#f27474'
//       });
//     } else {
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: 'Something went wrong while processing your request.',
//         confirmButtonColor: '#dc3545'
//       });
//     }
//   }
// }





//   branchForm!: FormGroup;

//   constructor(private fb: FormBuilder, private http: HttpReqService, private router: Router) {}

//   ngOnInit(): void {
//     this.initForm();
//     // this.branchForm = this.fb.group({
//     //   name: ['', Validators.required],
//     //   mobile: ['', Validators.required],
//     //   address: ['', Validators.required]
//     // });
//   }

//   initForm(): void {
//     this.branchForm = this.fb.group({
//          name: ['', Validators.required],
//          mobile: ['', Validators.required],
//          location: ['', Validators.required]
//     });
//     console.log(this.branchForm.value);
//   }

//   onSubmit(): void {
//     console.log(this.branchForm.value)
//     if (this.branchForm.invalid) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Validation Error',
//         text: 'Please fill all required fields correctly.',
//       });
//       return;
//     }

//     console.log('Form values:', this.branchForm.value); 

//     this.http.create('Branch', this.branchForm.value).subscribe({
//       next: res => {
//         Swal.fire({
//           icon: 'success',
//           title: 'Success!',
//           text: 'Branch added successfully!',
//           confirmButtonText: 'OK'
//         });
//         this.branchForm.reset();
//       },
//       error: err => {
//         console.error(err);
//         Swal.fire({
//           icon: 'error',
//           title: 'Failed!',
//           text: 'Something went wrong while adding branch.',
//           confirmButtonText: 'OK'
//         });
//       }
//     });
//   }

//   fc = (control: string) => this.branchForm.get(control);
//   isInvalid = (control: string): boolean => {
//     const controlInstance = this.fc(control);
//     return controlInstance ? controlInstance.invalid && (controlInstance.touched || controlInstance.dirty) : false;
//   };
// }

