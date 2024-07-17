import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateElementFormComponent } from './update-element-form.component';

describe('AddElementFormComponent', () => {
  let component: UpdateElementFormComponent;
  let fixture: ComponentFixture<UpdateElementFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateElementFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateElementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
