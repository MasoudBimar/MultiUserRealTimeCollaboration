import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { RouterOutlet } from '@angular/router';
import { debounce, distinctUntilChanged, interval, Subject } from 'rxjs';
import { AddElementFormComponent } from '../add-element-form/add-element-form.component';
import { CardComponent } from '../card/card.component';
import { CustomizableDirective } from '../directives/customizable.directive';
import { CustomizableModel, DomRectModel, MetaData } from '../model/customizable.model';
import { NewCRDTWSService } from '../services/new-crdt-ws.service';
import { SnackBarService } from '../services/snackbar.service';

@Component({
  selector: 'app-test',
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
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent implements OnDestroy {
  // private webSocketSubscription: Subscription;
  title = 'Multi-User Real-Time Collaboration App Creatingly';
  itemResized$: Subject<{ domRect: DomRectModel, id: string }> = new Subject<{ domRect: DomRectModel, id: string }>();
  itemDropped$: Subject<{ domRect: DomRectModel, id: string }> = new Subject<{ domRect: DomRectModel, id: string }>();
  constructor(public crdtwsService: NewCRDTWSService<CustomizableModel>, public dialog: MatDialog, public snackBarService: SnackBarService) {

    this.itemResized$.pipe(distinctUntilChanged(), debounce(() => interval(100)),).subscribe((event: { domRect: DomRectModel, id: string }) => {
      this.crdtwsService.updateItem(event.id, event.domRect);
    });

    this.itemDropped$.subscribe((event: { domRect: DomRectModel, id: string }) => {
      this.crdtwsService.updateItem(event.id, event.domRect);
    });
  }

  ngOnDestroy() {
    console.log('######');
    // this.webSocketSubscription.unsubscribe();
  }

  addNewElement() {
    const dialogRef = this.dialog.open(AddElementFormComponent);

    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        const newItem = new CustomizableModel();
        newItem.metaData = new MetaData(response.label);
        newItem.itemType = response.itemType;
        this.crdtwsService.insert(newItem);
        this.snackBarService.openSuccess('ToDo Item Created', 'Ok');
      } else {
        this.snackBarService.openError('Operation Failed', 'Ok');
      }
    });
  }

  clearBorad() {
    this.crdtwsService.clear();
  }

  deleteItem(idx: string) {
    this.crdtwsService.delete(idx);
  }

  toggleConnection(){
    if (this.crdtwsService.websocketService.isConnected) {
      this.crdtwsService.close();
    }
  }
}
