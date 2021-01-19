import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionesVendedoresComponent } from './comisiones-vendedores.component';

describe('ComisionesVendedoresComponent', () => {
  let component: ComisionesVendedoresComponent;
  let fixture: ComponentFixture<ComisionesVendedoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComisionesVendedoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComisionesVendedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
