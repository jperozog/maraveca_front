import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentasIncombrablesComponent } from './cuentas-incombrables.component';

describe('CuentasIncombrablesComponent', () => {
  let component: CuentasIncombrablesComponent;
  let fixture: ComponentFixture<CuentasIncombrablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuentasIncombrablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentasIncombrablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
