import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallWrapUpComponent } from './call-wrap-up.component';

describe('CallWrapUpComponent', () => {
  let component: CallWrapUpComponent;
  let fixture: ComponentFixture<CallWrapUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallWrapUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallWrapUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
