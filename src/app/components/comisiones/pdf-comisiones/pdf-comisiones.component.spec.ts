import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfComisionesComponent } from './pdf-comisiones.component';

describe('PdfComisionesComponent', () => {
  let component: PdfComisionesComponent;
  let fixture: ComponentFixture<PdfComisionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfComisionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfComisionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
