import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTransferenciasComponent } from './lista-transferencias.component';

describe('ListaTransferenciasComponent', () => {
  let component: ListaTransferenciasComponent;
  let fixture: ComponentFixture<ListaTransferenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaTransferenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaTransferenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
