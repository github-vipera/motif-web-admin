import { Component, OnInit, ViewChild, Input, ElementRef, Renderer } from '@angular/core';
import { PluginView } from 'web-console-core'
import { NGXLogger} from 'web-console-core'
import { SecurityService } from '@wa-motif-open-api/security-service'
import { SessionRow } from '../data/model'
import { GridDataResult, GridComponent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { WCToasterService } from 'web-console-ui-kit'
import { WCGridConfiguration } from 'web-console-ui-kit'
import { SortDescriptor, GroupDescriptor, DataResult } from '@progress/kendo-data-query';
import { MotifQuerySort, MotifQueryResults, MotifQueryService } from 'web-console-core';
import { DomainsService, DomainsList, Domain } from '@wa-motif-open-api/platform-service'


const LOG_TAG = "[SessionsSection]";

@Component({
    selector: 'wa-sessions-section',
    styleUrls: [ './sessions-section.component.scss' ],
    templateUrl: './sessions-section.component.html'
  })
  @PluginView("Sessions",{
    iconName: "ico-users" 
})
export class SessionsSectionComponent implements OnInit {

    @ViewChild(GridComponent) _grid : GridComponent;

    //Grid Options
    public gridConfiguration:WCGridConfiguration;
    public sort: SortDescriptor[] = [];
    public groups: GroupDescriptor[] = [];
    public gridView: DataResult;
    public type: 'numeric' | 'input' = 'numeric';
    public pageSize = 15;
    public skip = 0;
    public currentPage = 1;
    public totalPages = 0;
    public totalRecords = 0;
    public isFieldSortable=false;
      
    public domainList: DomainsList = [];
    public _selectedDomain:Domain; //combo box selection
  
    private _sessionRows : SessionRow[] = [];

    constructor(private logger: NGXLogger, 
        private securityService:SecurityService,
        private toaster: WCToasterService,
        private domainsService:DomainsService,
        private renderer:Renderer){
        this.logger.debug(LOG_TAG ,"Opening...");
    } 
    
    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG ,"Initializing...");
        this.refreshDomainList();
        this.loadData(null, 1, this.pageSize);
    }


    /**
     * Get the list of the available Domains
     */
    public refreshDomainList():void {
        this.domainsService.getDomains().subscribe(data=>{
        this.domainList = data;
        }, error=>{
        console.error("Error: ", error);
        });
    } 
    
    private loadData(domain:string, pageIndex:number, pageSize:number){
          this.logger.debug(LOG_TAG, "loadData domain='" + domain+ "' pageIndex=", pageIndex, " pageSize=", pageSize);
    
          let sort:MotifQuerySort = this.buildQuerySort();
            
          this.securityService.getSessions(null, null, domain, null, null, null, pageIndex, pageSize, 'response').subscribe((response)=>{
    
            let results:MotifQueryResults = MotifQueryResults.fromHttpResponse(response);
            
            this.logger.debug(LOG_TAG ,"Query results:", results);

            this._sessionRows = _.forEach(results.data, function(element) {
                element.lastAccess = new Date(element.lastAccess);
              });
  
            //this._sessionRows = results.data;
            this.totalPages = results.totalPages;
            this.totalRecords = results.totalRecords;
            this.currentPage = results.pageIndex;
            this.gridView = {
                data: this._sessionRows,
                total: results.totalRecords
              }
              
    
          }, error=>{
            this.logger.error(LOG_TAG, "getRefreshTokenList failed: ", error);
          });
      }
    
      public pageChange({ skip, take }: PageChangeEvent): void {
        this.logger.debug(LOG_TAG, "pageChange skip=", skip, " take=", take);
        this.skip = skip;
        this.pageSize = take;
        let newPageIndex = this.calculatePageIndex(skip, take);
        this.loadData(newPageIndex, this.pageSize);
      }
    
      private calculatePageIndex(skip:number, take:number):number {
        return (skip/take)+1;
      }
    
      private buildQuerySort():MotifQuerySort {
        this.logger.debug(LOG_TAG, "buildQuerySort: ", this.sort);
        let querySort = new MotifQuerySort();
        if (this.sort){
          for (let i=0;i<this.sort.length;i++){
            let sortInfo = this.sort[i];
            if (sortInfo.dir && sortInfo.dir === "asc"){
              querySort.orderAscendingBy(sortInfo.field);
            } else if (sortInfo.dir && sortInfo.dir === "desc"){
              querySort.orderDescendingBy(sortInfo.field);
            }
          }
        }
        return querySort;
      }
    
    /**
     * Set the selcted domain
     */
    @Input()
    public set selectedDomain(domain:Domain){
        this._selectedDomain = domain;
        if (this._selectedDomain){
            this.logger.debug(LOG_TAG, "selectedDomain domain=", this._selectedDomain.name);
            this.loadData(this._selectedDomain.name, 1, this.pageSize);
        } else {
            this.logger.debug(LOG_TAG, "selectedDomain domain=no selection");
            this.loadData(null, 1, this.pageSize);
        }
    }
}
