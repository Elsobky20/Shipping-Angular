import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegectReasonformComponent } from './regect-reasonform.component';

describe('RegectReasonformComponent', () => {
  let component: RegectReasonformComponent;
  let fixture: ComponentFixture<RegectReasonformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegectReasonformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegectReasonformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
