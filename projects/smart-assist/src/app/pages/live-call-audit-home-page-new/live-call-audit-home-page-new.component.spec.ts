import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveCallAuditHomePageNewComponent } from './live-call-audit-home-page-new.component';

describe('LiveCallAuditHomePageNewComponent', () => {
  let component: LiveCallAuditHomePageNewComponent;
  let fixture: ComponentFixture<LiveCallAuditHomePageNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveCallAuditHomePageNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveCallAuditHomePageNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
