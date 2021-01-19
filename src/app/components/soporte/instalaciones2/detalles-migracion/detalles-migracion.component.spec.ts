import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesMigracionComponent } from './detalles-migracion.component';

describe('DetallesMigracionComponent', () => {
  let component: DetallesMigracionComponent;
  let fixture: ComponentFixture<DetallesMigracionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallesMigracionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallesMigracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
