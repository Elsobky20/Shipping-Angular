import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpReqService } from '../../../GeneralSrevices/http-req.service';
import { OrderService } from '../../services/order.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-add',
  imports: [ReactiveFormsModule, RouterLink, NgSelectModule, CommonModule],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.css'
})
export class OrderFormComponent implements OnInit{
  tableForm!: FormGroup;
  newEditParam:any;
  merchantId!:number;

  orderId!:number;
  mySubscribe!:any;
  allBranches!: any[];
  allGovernrates!:any[];
  allCities!:any[];
  filteredCities!:any[];
  allShippingTypes!:any[];

  allPaymentTypes = [
    { label: 'Prepaid', value: 'Prepaid' },
    { label: 'Package Swap', value: 'PackageSwap' },
    { label: 'Cash On Delivery', value: 'CashOnDelivery' }
  ];
  allOrderTypes = [
    { label: 'Pickup From Branch', value: 'PickupFromBranch' },
    { label: 'Pickup From Merchant', value: 'PickupFromMerchant' }
  ];

  constructor(
      private httpReqService:HttpReqService,
      private activatedRoute:ActivatedRoute,
      private router:Router,
      private orderService:OrderService,
      private fb: FormBuilder
    ) {}
  /* ========================================================================================================= */
  orderForm = new FormGroup({
    orderType: new FormControl('', [Validators.required]),
    branch_Id: new FormControl('', [Validators.required]),
    government_Id: new FormControl('', [Validators.required]),
    shippingType_Id: new FormControl('', [Validators.required]),
    city_Id: new FormControl('', [Validators.required]),
    clientName: new FormControl('', [Validators.required, Validators.maxLength(5)]),
    clientPhone1: new FormControl('', [Validators.required, Validators.pattern(/^(?:\+20|0)?1[0-2,5]{1}[0-9]{8}$/)]),
    clientPhone2: new FormControl('', [Validators.pattern(/^(?:\+20|0)?1[0-2,5]{1}[0-9]{8}$/)]),
    clientEmail: new FormControl('', [Validators.required, Validators.email]),
    clientAddress: new FormControl(''),
    deliverToVillage: new FormControl(false),
    paymentType: new FormControl('', [Validators.required]),
    orderCost: new FormControl('', [Validators.required, Validators.min(0)]),
    orderTotalWeight: new FormControl(0, [Validators.min(0)]),
    merchantNotes: new FormControl('', { nonNullable: true }),
    products: new FormArray([])
  });



  // getters
  get getBranchId() {
    return this.orderForm.controls['branch_Id'];
  }
  get getGovernmentId() {
    return this.orderForm.controls['government_Id'];
  }
  get getShippingTypeId() {
    return this.orderForm.controls['shippingType_Id'];
  }
  get getCityId() {
    return this.orderForm.controls['city_Id'];
  }
  get getOrderType() {
    return this.orderForm.controls['orderType'];
  }
  get getClientName() {
    return this.orderForm.controls['clientName'];
  }
  get getClientPhone1() {
    return this.orderForm.controls['clientPhone1'];
  }
  get getClientPhone2() {
    return this.orderForm.controls['clientPhone2'];
  }
  get getClientEmail() {
    return this.orderForm.controls['clientEmail'];
  }
  get getClientAddress() {
    return this.orderForm.controls['clientAddress'];
  }
  get getDeliverToVillage() {
    return this.orderForm.controls['deliverToVillage'];
  }
  get getPaymentType() {
    return this.orderForm.controls['paymentType'];
  }
  get getOrderCost() {
    return this.orderForm.controls['orderCost'];
  }
  get getOrderTotalWeight() {
    return this.orderForm.controls['orderTotalWeight'];
  }
  get getMerchantNotes() {
    return this.orderForm.controls['merchantNotes'];
  }
  get products(): FormArray<FormGroup> {
    return this.orderForm.get('products') as unknown as FormArray<FormGroup>;
  }

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('userRoles');
    console.log(userId, role)
    if (userId && role) {
      this.orderService.getUserByRole(userId, role).subscribe({
        next: (response) => {
          this.merchantId = response.userId
        },
        error: (error) => console.log(error)
      });
    }



    this.orderForm = new FormGroup({
      orderType: new FormControl('', [Validators.required]),
      branch_Id: new FormControl('', [Validators.required]),
      government_Id: new FormControl('', [Validators.required]),
      shippingType_Id: new FormControl('', [Validators.required]),
      city_Id: new FormControl('', [Validators.required]),
      clientName: new FormControl('', [Validators.required, Validators.maxLength(5)]),
      clientPhone1: new FormControl('', [Validators.required, Validators.pattern(/^(?:\+20|0)?1[0-2,5]{1}[0-9]{8}$/)]),
      clientPhone2: new FormControl('', [Validators.pattern(/^(?:\+20|0)?1[0-2,5]{1}[0-9]{8}$/)]),
      clientEmail: new FormControl('', [Validators.required, Validators.email]),
      clientAddress: new FormControl(''),
      deliverToVillage: new FormControl(false),
      paymentType: new FormControl('', [Validators.required]),
      orderCost: new FormControl('', [Validators.required, Validators.min(0)]),
      orderTotalWeight: new FormControl(0, [Validators.min(0)]),
      merchantNotes: new FormControl('', { nonNullable: true }),
      products: new FormArray([])
    });

    // 2. جلب الداتا من الـ API
    this.orderService.getExistingGovernments().subscribe({
      next: (response) => {
        this.allGovernrates = response.governments;
      },
      error: (error) => console.log(error)
    });

    this.orderService.getExistingCities().subscribe({
      next: (response) => {
        this.allCities = response.data.cities;
        console.log(this.allCities);
      },
      error: (error) => console.log(error)
    });

    // 3. ربط التغيير في المحافظة بتصفية المدن
    this.orderForm.get('government_Id')?.valueChanges.subscribe((selectedGovId: number | string | null) => {
      const govName = (this.allGovernrates.find(g => g.id === Number(selectedGovId))).name;
      this.filteredCities = this.allCities.filter(city => city.governmentName === govName);
      this.orderForm.get('city_Id')?.reset();
    });

    this.orderService.getExistingShippingTypes().subscribe({
      next: (response) => {
        this.allShippingTypes = response;
        console.log(this.allShippingTypes)
      },
      error: (error) => {
        console.log(error)
      }
    })

    this.orderService.getExistingBranches().subscribe({
      next: (response) => {
        this.allBranches = response.data.branches;
      },
      error: (error) => {
        console.log(error)
      }
    })
    /* ================================================ */
    this.tableForm = this.fb.group({
      rows: this.fb.array([]),
    });

    /* ================================================ */

    /* ================================================ */
    // Step 2: Load city info if editing
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.orderId = Number(params.get('id'));
        this.orderForm.reset(); // Reset the form at first

        if (this.orderId !== 0) {
          // Edit Mode
          this.httpReqService.getById('order', this.orderId).subscribe({
            next: (response) => {
              console.log('edit', response)
              const orderData = response.data;
              this.orderForm.patchValue({
                branch_Id: orderData.branch_Id,
                government_Id: orderData.government_Id,
                shippingType_Id: orderData.shippingType_Id,
                city_Id: orderData.city_Id,
                orderType: orderData.orderType,
                clientName: orderData.clientName,
                clientPhone1: orderData.clientPhone1,
                clientPhone2: orderData.clientPhone2,
                clientEmail: orderData.clientEmail,
                clientAddress: orderData.clientAddress,
                deliverToVillage: orderData.deliverToVillage,
                paymentType: orderData.paymentType,
                orderCost: orderData.orderCost,
                orderTotalWeight: orderData.orderTotalWeight,
                merchantNotes: orderData.merchantNotes,
              });

              // Handle Products (if any)
              // if (orderData.products && Array.isArray(orderData.products)) {
              //   const productsFormArray = this.products;
              //   productsFormArray.clear();

              //   orderData.products.forEach((product: any) => {
              //     productsFormArray.push(new FormGroup({
              //       productName: new FormControl(product.productName),
              //       quantity: new FormControl(product.quantity),
              //       price: new FormControl(product.price)
              //     }));
              //   });
              // }
            },
            error: (err) => {
              console.error('Error fetching order by ID:', err);
            }
          });
        }
      }
    });
  }

  get rows(): FormArray {
    return this.tableForm.get('rows') as FormArray;
  }

  orderHandler(): void {
    this.newEditParam = {
      ...this.orderForm.value,
      merchant_Id: this.merchantId,
      products: [{name: 'phone1', quantity: 10, ItemWeight: 1},
        {name: 'phone2', quantity: 20, ItemWeight: 2}]
    }
    console.log(this.newEditParam )
    console.log(this.orderForm.value)
    if (this.orderForm.status === 'VALID') {
      if (this.orderId === 0) {
        this.httpReqService.create('Order', this.newEditParam).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Order added!',
              text: `"${this.orderForm.get('clientName')?.value}" has been added successfully.`,
              confirmButtonColor: '#28a745'
            });
            this.router.navigate(['/order']);
          },
          error: (error) => {
            if (error.error.error === "Order is already exist.") {
              Swal.fire({
                icon: 'warning',
                title: 'Duplicate Order',
                text: `An order for "${this.orderForm.get('clientName')?.value}" already exists.`,
                confirmButtonColor: '#f27474'
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong while adding the order.',
                confirmButtonColor: '#dc3545'
              });
            }
          }
        });
      } else {
        this.newEditParam = {
          ...this.orderForm.value,
          merchant_Id: this.merchantId,
          products: [{name: 'phone1', quantity: 10, ItemWeight: 1},
            {name: 'phone2', quantity: 20, ItemWeight: 2}]
        }

        this.httpReqService.editById('Order', this.orderId, this.newEditParam).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Order updated!',
              text: `"${this.orderForm.get('clientName')?.value}" has been updated successfully.`,
              confirmButtonColor: '#28a745'
            });
            this.router.navigate(['/order']);
          },
          error: (error) => {
            if (error.error.error === "Order is already exist.") {
              Swal.fire({
                icon: 'warning',
                title: 'Duplicate Order',
                text: `An order for "${this.orderForm.get('clientName')?.value}" already exists.`,
                confirmButtonColor: '#f27474'
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong while updating the order.',
                confirmButtonColor: '#dc3545'
              });
            }
          }
        });
      }
    }
  }


  cancelHandeler(): void {
    if (this.orderId === 0) {
      this.orderForm.reset({
        branch_Id: '',
        government_Id: '',
        shippingType_Id: '',
        city_Id: '',
        orderType: '',
        clientName: '',
        clientPhone1: '',
        clientPhone2: '',
        clientEmail: '',
        clientAddress: '',
        deliverToVillage: false,
        paymentType: '',
        orderCost: '',
        orderTotalWeight: 0,
        merchantNotes: '',
        products: []
      });
      (this.orderForm.get('products') as FormArray).clear();
    } else {
      this.router.navigate(['order']);
    }
  }

}
