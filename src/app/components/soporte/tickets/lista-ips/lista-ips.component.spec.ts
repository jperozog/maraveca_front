import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaIpsComponent } from './lista-ips.component';

describe('ListaIpsComponent', () => {
  let component: ListaIpsComponent;
  let fixture: ComponentFixture<ListaIpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaIpsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaIpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
