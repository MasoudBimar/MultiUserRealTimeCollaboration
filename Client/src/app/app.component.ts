import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { RouterOutlet } from '@angular/router';
import { Subject, debounce, distinctUntilChanged, interval } from 'rxjs';
import { AddElementFormComponent } from './add-element-form/add-element-form.component';
import { CardComponent } from './card/card.component';
import { CustomizableDirective } from './directives/customizable.directive';
import { CustomizableModel, DomRectModel, MetaData } from './model/customizable.model';
import { CRDTService } from './services/crdt.service';
import { SnackBarService } from './services/snackbar.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CustomizableDirective,
    MatInputModule,
    CommonModule,
    MatButtonModule,
    CardComponent,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Multi-User Real-Time Collaboration App Creatingly';
  itemResized$: Subject<{domRect: DomRectModel, id: string}> = new Subject<{domRect: DomRectModel, id: string}>();
  itemDropped$: Subject<{domRect: DomRectModel, id: string}> = new Subject<{domRect: DomRectModel, id: string}>();
  constructor(public dialog: MatDialog,public snackBarService: SnackBarService, public crdtService: CRDTService) {
    this.itemResized$.pipe(distinctUntilChanged(), debounce(() => interval(100)),).subscribe((event:{domRect: DomRectModel, id: string}) => {
      this.crdtService.updateItem(event.id, event.domRect );
    });

    this.itemDropped$.subscribe((event: {domRect: DomRectModel, id: string}) => {
        this.crdtService.updateItem(event.id, event.domRect );
    });
  }

  addNewElement() {
    const dialogRef = this.dialog.open(AddElementFormComponent );

    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        const newItem = new CustomizableModel();
        newItem.metaData= new MetaData( response.label);
        newItem.itemType = response.itemType;
          this.crdtService.insert(newItem);
          this.snackBarService.openSuccess('ToDo Item Created', 'Ok');
      } else{
        this.snackBarService.openError('Operation Failed', 'Ok');
      }
    });
  }

  connect(){
    this.crdtService.connect();
  }

  clearBorad(){
    this.crdtService.clear();
  }

  deleteItem(idx: string){
    this.crdtService.delete(idx);
  }
}
