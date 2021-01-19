import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesMudanzaComponent } from './detalles-mudanza.component';

describe('DetallesMudanzaComponent', () => {
  let component: DetallesMudanzaComponent;
  let fixture: ComponentFixture<DetallesMudanzaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallesMudanzaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallesMudanzaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
