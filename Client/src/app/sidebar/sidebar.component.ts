import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { AddElementFormComponent } from '../add-element-form/add-element-form.component';
import { CustomizableModel } from '../model/customizable.model';
import { NewCRDTWSService } from '../services/new-crdt-ws.service';
import { SnackBarService } from '../services/snackbar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatGridListModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  mode = new FormControl('side' as MatDrawerMode);
  /**
   *
   */
  constructor(public crdtwsService: NewCRDTWSService<CustomizableModel>, public dialog: MatDialog, public snackBarService: SnackBarService) {

  }

  addNewElement() {
    const dialogRef = this.dialog.open(AddElementFormComponent);

    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        const newItem = new CustomizableModel();
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
    if (this.crdtwsService.websocketService.connectionStatus) {
      this.crdtwsService.close();
    } else {
      this.crdtwsService.open();
    }
  }
}
