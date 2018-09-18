import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PotencialesComponent } from './potenciales.component';

describe('PotencialesComponent', () => {
  let component: PotencialesComponent;
  let fixture: ComponentFixture<PotencialesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PotencialesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PotencialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
