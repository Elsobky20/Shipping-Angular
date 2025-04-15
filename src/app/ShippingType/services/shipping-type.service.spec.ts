import { TestBed } from '@angular/core/testing';

import { ShippingTypeService } from './shipping-type.service';

describe('ShippingTypeService', () => {
  let service: ShippingTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShippingTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
