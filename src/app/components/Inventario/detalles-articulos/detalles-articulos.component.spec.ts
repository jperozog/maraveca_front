import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesArticulosComponent } from './detalles-articulos.component';

describe('DetallesArticulosComponent', () => {
  let component: DetallesArticulosComponent;
  let fixture: ComponentFixture<DetallesArticulosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallesArticulosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallesArticulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
