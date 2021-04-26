import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagosInstalacionComponent } from './pagos-instalacion.component';

describe('PagosInstalacionComponent', () => {
  let component: PagosInstalacionComponent;
  let fixture: ComponentFixture<PagosInstalacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagosInstalacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagosInstalacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
