import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernmentFormComponent } from './government-form.component';

describe('GovernmentFormComponent', () => {
  let component: GovernmentFormComponent;
  let fixture: ComponentFixture<GovernmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovernmentFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GovernmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
