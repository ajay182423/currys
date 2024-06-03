import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiEntityExtractNewComponent } from './ai-entity-extract-new.component';

describe('AiEntityExtractNewComponent', () => {
  let component: AiEntityExtractNewComponent;
  let fixture: ComponentFixture<AiEntityExtractNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiEntityExtractNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AiEntityExtractNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
