import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenTrasladoComponent } from './orden-traslado.component';

describe('OrdenTrasladoComponent', () => {
  let component: OrdenTrasladoComponent;
  let fixture: ComponentFixture<OrdenTrasladoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdenTrasladoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenTrasladoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
