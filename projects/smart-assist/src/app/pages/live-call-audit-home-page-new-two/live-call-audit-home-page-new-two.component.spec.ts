import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveCallAuditHomePageNewTwoComponent } from './live-call-audit-home-page-new-two.component';

describe('LiveCallAuditHomePageNewTwoComponent', () => {
  let component: LiveCallAuditHomePageNewTwoComponent;
  let fixture: ComponentFixture<LiveCallAuditHomePageNewTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveCallAuditHomePageNewTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveCallAuditHomePageNewTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
