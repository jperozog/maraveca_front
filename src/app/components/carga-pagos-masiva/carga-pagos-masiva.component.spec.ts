import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaPagosMasivaComponent } from './carga-pagos-masiva.component';

describe('CargaPagosMasivaComponent', () => {
  let component: CargaPagosMasivaComponent;
  let fixture: ComponentFixture<CargaPagosMasivaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargaPagosMasivaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaPagosMasivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
