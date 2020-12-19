import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditItemDetailPage } from './edit-item-detail.page';

describe('EditItemDetailPage', () => {
  let component: EditItemDetailPage;
  let fixture: ComponentFixture<EditItemDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditItemDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditItemDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
