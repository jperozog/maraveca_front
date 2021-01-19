import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Instalaciones2Component } from './instalaciones2.component';

describe('Instalaciones2Component', () => {
  let component: Instalaciones2Component;
  let fixture: ComponentFixture<Instalaciones2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Instalaciones2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Instalaciones2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
