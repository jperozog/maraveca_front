import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquiposGrupalesComponent } from './equipos-grupales.component';

describe('EquiposGrupalesComponent', () => {
  let component: EquiposGrupalesComponent;
  let fixture: ComponentFixture<EquiposGrupalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquiposGrupalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquiposGrupalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
