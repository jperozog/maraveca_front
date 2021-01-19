import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Zonas2Component } from './zonas2.component';

describe('Zonas2Component', () => {
  let component: Zonas2Component;
  let fixture: ComponentFixture<Zonas2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Zonas2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Zonas2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
