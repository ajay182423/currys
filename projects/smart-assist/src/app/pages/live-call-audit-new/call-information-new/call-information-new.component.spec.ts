import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallInformationNewComponent } from './call-information-new.component';

describe('CallInformationNewComponent', () => {
  let component: CallInformationNewComponent;
  let fixture: ComponentFixture<CallInformationNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallInformationNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallInformationNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
