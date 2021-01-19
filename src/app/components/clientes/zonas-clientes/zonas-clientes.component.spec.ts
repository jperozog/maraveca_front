import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonasClientesComponent } from './zonas-clientes.component';

describe('ZonasClientesComponent', () => {
  let component: ZonasClientesComponent;
  let fixture: ComponentFixture<ZonasClientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZonasClientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZonasClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
