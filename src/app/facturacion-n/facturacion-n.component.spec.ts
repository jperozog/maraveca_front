import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturacionNComponent } from './facturacion-n.component';

describe('FacturacionNComponent', () => {
  let component: FacturacionNComponent;
  let fixture: ComponentFixture<FacturacionNComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturacionNComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturacionNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
