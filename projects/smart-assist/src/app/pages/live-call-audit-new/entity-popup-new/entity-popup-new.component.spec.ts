import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityPopupNewComponent } from './entity-popup-new.component';

describe('EntityPopupNewComponent', () => {
  let component: EntityPopupNewComponent;
  let fixture: ComponentFixture<EntityPopupNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityPopupNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityPopupNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
