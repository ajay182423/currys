import { AfterContentInit, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.scss']
})
export class TableFilterComponent implements OnInit {

  @Input() filterParams:any;
  @Input() tableData:any;
  @Input() showFilterView:boolean = false;
  showFilter:boolean = false;
  showParams:boolean = false;
  showTitleFields:boolean = false;
  showFilterOption:any;
  filterTitle:any;
  filterType:any;
  appliedFilter: any[] = [];
  @Output() changeData = new EventEmitter();
  @Output() searchKey = new EventEmitter();
  indexItem: any;
  filterdata:any[]=[];
  searchParam: any;

  constructor(private fb:FormBuilder) {
    
   }
 
   public filterApplied$ = new BehaviorSubject<string[]>([]);

  ngOnInit(): void {
    this.tableData.forEach(element => {
      console.log(element+'jhgjhgkj');
    });

    this.filterParams = this.filterParams.filter(f => f.filter == true);
  }


  @HostListener('document:click', ['$event']) onDocumentClick(event) {
    this.showFilter  = false;
    this.showParams  = false;
    this.showTitleFields  = false;
  }


  SearchAll(input) {
      this.searchKey.emit(input);
  }

  addNewFilter($event){
    $event.stopPropagation()
    this.showFilter = !this.showFilter
    this.showParams = false;
    this.showTitleFields = false;
  }
  addFilter($event){
    $event.stopPropagation()
    this.showParams = !this.showParams;
    this.showTitleFields = false
    
  }
  openForm(filter:any, $event){
    this.indexItem = this.filterParams[filter].alias
    this.searchParam = this.filterParams[filter].name
    this.filterdata = [];
    this.tableData.forEach(item => {      
        if( typeof(item[this.filterParams[filter].alias]) == 'object' ) {
          item[this.filterParams[filter].alias].map(m => 
            {
              if(!this.filterdata.includes(m)) {                 
                this.filterdata.push(m)
              }
            }
          );
        }
        else {
          if(!this.filterdata.includes(item[this.filterParams[filter].alias])) {
            this.filterdata.push(item[this.filterParams[filter].alias]);
          }
        }   
    });
    
    $event.stopPropagation()
    this.showTitleFields = true
    this.filterTitle = filter.name;
    
    // if(filter.type == "number") {
    //   this.showFilterOption = 'number'
    // }
    // else if(filter.type == "string") {
    //   this.showFilterOption = 'string'
    // }
    // else {
    //   this.showFilterOption = 'date'
    // }    
  }

  onFilter(data) {
    //console.log(data);

    if(!this.appliedFilter.some(s=> s.searchValue == data)){
      this.appliedFilter.push({
        searchParam : this.searchParam,
        searchValue : data
      }); 
    }
     
  }
  onClickSubmit(formValue){
   // console.log(formValue.value);    
    this.appliedFilter.push(formValue.value);   
    this.changeData.emit(formValue.value.formInput)
  }
  
  removeFilter(formValue, index:number){
    this.appliedFilter.splice(index, 1)
  }

}
