import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallTranscriptNewComponent } from './call-transcript-new.component';

describe('CallTranscriptNewComponent', () => {
  let component: CallTranscriptNewComponent;
  let fixture: ComponentFixture<CallTranscriptNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallTranscriptNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallTranscriptNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
