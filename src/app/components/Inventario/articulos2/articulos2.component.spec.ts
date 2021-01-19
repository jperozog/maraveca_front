import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Articulos2Component } from './articulos2.component';

describe('Articulos2Component', () => {
  let component: Articulos2Component;
  let fixture: ComponentFixture<Articulos2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Articulos2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Articulos2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
