import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoporteTrasladoComponent } from './soporte-traslado.component';

describe('SoporteTrasladoComponent', () => {
  let component: SoporteTrasladoComponent;
  let fixture: ComponentFixture<SoporteTrasladoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoporteTrasladoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoporteTrasladoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
