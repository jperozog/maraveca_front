import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CajaDistribucionComponent } from './caja-distribucion.component';

describe('CajaDistribucionComponent', () => {
  let component: CajaDistribucionComponent;
  let fixture: ComponentFixture<CajaDistribucionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CajaDistribucionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CajaDistribucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
