import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CeldasComponent } from './celdas.component';

describe('CeldasComponent', () => {
  let component: CeldasComponent;
  let fixture: ComponentFixture<CeldasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CeldasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CeldasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
