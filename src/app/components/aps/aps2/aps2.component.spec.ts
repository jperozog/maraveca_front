import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Aps2Component } from './aps2.component';

describe('Aps2Component', () => {
  let component: Aps2Component;
  let fixture: ComponentFixture<Aps2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Aps2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Aps2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
