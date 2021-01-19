import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MangaEmpalmeComponent } from './manga-empalme.component';

describe('MangaEmpalmeComponent', () => {
  let component: MangaEmpalmeComponent;
  let fixture: ComponentFixture<MangaEmpalmeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MangaEmpalmeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MangaEmpalmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
