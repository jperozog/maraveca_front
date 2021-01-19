import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Servidores2Component } from './servidores2.component';

describe('Servidores2Component', () => {
  let component: Servidores2Component;
  let fixture: ComponentFixture<Servidores2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Servidores2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Servidores2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
