import { TestBed } from '@angular/core/testing';

import { GovernmentServiceService } from './government.service.service';

describe('GovernmentServiceService', () => {
  let service: GovernmentServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GovernmentServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
