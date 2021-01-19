import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Equipos2Component } from './equipos2.component';

describe('Equipos2Component', () => {
  let component: Equipos2Component;
  let fixture: ComponentFixture<Equipos2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Equipos2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Equipos2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
