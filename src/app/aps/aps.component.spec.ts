import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApsComponent } from './aps.component';

describe('ApsComponent', () => {
  let component: ApsComponent;
  let fixture: ComponentFixture<ApsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
