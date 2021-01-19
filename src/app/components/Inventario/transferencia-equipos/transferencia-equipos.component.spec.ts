import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferenciaEquiposComponent } from './transferencia-equipos.component';

describe('TransferenciaEquiposComponent', () => {
  let component: TransferenciaEquiposComponent;
  let fixture: ComponentFixture<TransferenciaEquiposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferenciaEquiposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferenciaEquiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
