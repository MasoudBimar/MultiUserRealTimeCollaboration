import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { CRDTWSService } from '../services/crdt-ws.service';
import { CustomizableModel, MetaData } from '../model/customizable.model';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from '../services/snackbar.service';
import { AddElementFormComponent } from '../add-element-form/add-element-form.component';
import { CommonModule } from '@angular/common';
import { NewCRDTWSService } from '../services/new-crdt-ws.service';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';

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
    if (this.crdtwsService.websocketService.connectionStatus) {
      this.crdtwsService.close();
    } else {
      this.crdtwsService.open();
    }
  }
}
