import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeShowComponent } from './knowledge-show.component';

describe('KnowledgeShowComponent', () => {
  let component: KnowledgeShowComponent;
  let fixture: ComponentFixture<KnowledgeShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KnowledgeShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
