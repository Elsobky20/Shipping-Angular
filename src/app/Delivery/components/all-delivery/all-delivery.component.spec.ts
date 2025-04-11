import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDeliveryComponent } from './all-delivery.component';

describe('AllDeliveryComponent', () => {
  let component: AllDeliveryComponent;
  let fixture: ComponentFixture<AllDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllDeliveryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
