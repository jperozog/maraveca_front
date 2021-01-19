import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfTrasladoComponent } from './pdf-traslado.component';

describe('PdfTrasladoComponent', () => {
  let component: PdfTrasladoComponent;
  let fixture: ComponentFixture<PdfTrasladoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfTrasladoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfTrasladoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
