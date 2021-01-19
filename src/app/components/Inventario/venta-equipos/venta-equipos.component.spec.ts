import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaEquiposComponent } from './venta-equipos.component';

describe('VentaEquiposComponent', () => {
  let component: VentaEquiposComponent;
  let fixture: ComponentFixture<VentaEquiposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentaEquiposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentaEquiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
