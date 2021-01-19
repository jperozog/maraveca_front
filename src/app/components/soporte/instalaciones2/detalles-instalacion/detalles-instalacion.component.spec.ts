import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesInstalacionComponent } from './detalles-instalacion.component';

describe('DetallesInstalacionComponent', () => {
  let component: DetallesInstalacionComponent;
  let fixture: ComponentFixture<DetallesInstalacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallesInstalacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallesInstalacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
