import { Component, OnInit, ViewChild,Inject } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { DataSource} from '@angular/cdk/collections';
import { SelectionModel } from '@angular/cdk/collections';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddNewItemComponent } from '../add-new-item/add-new-item.component';
import { EditItemComponent } from '../edit-item/edit-item.component';
import { Router } from '@angular/router';

@Component({
   moduleId: module.id,
   templateUrl: 'home.component.html',
   styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  users: User[] = [];
  ELEMENT_DATA: Element[] = [];
  username:string;

  displayedColumns = ['select','name', 'type', 'age', 'actionsColumn'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  selection = new SelectionModel<Element>(true, []);

  constructor(private userService: UserService,public dialog: MatDialog,private router: Router) { }

  ngOnInit() {
    this.username = this.userService.getUsername();
    
    this.userService.getPets()
        .subscribe(pets => {
          this.ELEMENT_DATA = pets;
          console.log(this.ELEMENT_DATA);
          this.selection = new SelectionModel<Element>(true, []);
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.dataSource.paginator = this.paginator;
        })
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  delete(){
    let id = [];
    for(let i=0;i<this.selection.selected.length;i++){
      id[i]=this.selection.selected[i]._id;
    }
    this.userService.removePets(id)
      .subscribe((res)=>
        this.userService.getPets()
          .subscribe(pets => {
            this.ELEMENT_DATA = pets;
            console.log(this.ELEMENT_DATA);
            this.selection = new SelectionModel<Element>(true, []);
            this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
            this.dataSource.paginator = this.paginator;
          })
      );
  }

  addElement(): void {
    let name='',type='',age=0;
    let dialogRef = this.dialog.open(AddNewItemComponent, {
      width: '300px',
      data: {
        name: name,
        type: type,
        age: age
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result.name != '' && result.type != '' && result.age > 0){
        this.userService.updateData = result;
        this.userService.addPets()
        .subscribe((r) => {
          this.userService.getPets()
          .subscribe(pets => {
            this.ELEMENT_DATA = pets;
            console.log(this.ELEMENT_DATA);
            this.selection = new SelectionModel<Element>(true, []);
            this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
            this.dataSource.paginator = this.paginator;
          })
        })
      }
      console.log('The dialog was closed');
    });
  }

  edit():void{
    let id = this.selection.selected[0]._id;
    let name = this.selection.selected[0].name;
    let type = this.selection.selected[0].type;
    let age = this.selection.selected[0].age;
    let dialogRef = this.dialog.open(EditItemComponent, {
      width: '300px',
      data: {
        name: name,
        type: type,
        age: age
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.name != '' && result.type != '' && result.age > 0){
        this.userService.updateData = this.ELEMENT_DATA;
        let updateData = {
          id: id,
          name: result.name,
          type: result.type,
          age: result.age
        };
        this.userService.updatePets(updateData)
          .subscribe((r) => {
            this.userService.getPets()
            .subscribe(pets => {
              this.ELEMENT_DATA = pets;
              console.log(this.ELEMENT_DATA);
              this.selection = new SelectionModel<Element>(true, []);
              this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
              this.dataSource.paginator = this.paginator;
            })
          })
      }
      console.log('The dialog was closed');
    });
  }

}

export interface Element {
  _id:string
  name: string;
  type: string;
  age: number;
}
  