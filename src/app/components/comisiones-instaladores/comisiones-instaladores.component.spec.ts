import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionesInstaladoresComponent } from './comisiones-instaladores.component';

describe('ComisionesInstaladoresComponent', () => {
  let component: ComisionesInstaladoresComponent;
  let fixture: ComponentFixture<ComisionesInstaladoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComisionesInstaladoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComisionesInstaladoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
