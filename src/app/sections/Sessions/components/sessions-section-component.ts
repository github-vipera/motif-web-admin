import { Component, OnInit, ViewChild, Input} from '@angular/core';
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
import { DomainsService, DomainsList, Domain, ApplicationsService, ApplicationsList, Application } from '@wa-motif-open-api/platform-service'
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';


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
    @ViewChild('applicationsCombo') _appComboBox : ComboBoxComponent;

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

    public applicationsList: ApplicationsList = [];
    public _selectedApplication:Application; //combo box selection

    public loading : boolean = false;

    private _sessionRows : SessionRow[] = [];

    constructor(private logger: NGXLogger, 
        private securityService:SecurityService,
        private toaster: WCToasterService,
        private domainsService:DomainsService,
        private applicationsService:ApplicationsService){
        this.logger.debug(LOG_TAG ,"Opening...");
    } 
    
    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG ,"Initializing...");
        this.refreshDomainList();
        this.loadData(null, null, 1, this.pageSize);
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

    public refreshApplicationsList():void {
        this._appComboBox.value = null;
        this._selectedApplication = undefined;
        if (this._selectedDomain){
            this.applicationsService.getApplications(this._selectedDomain.name).subscribe(data=>{
                this.applicationsList = data;
                }, error=>{
                console.error("Error: ", error);
                });
        } else {
            this.applicationsList = [];
        }
    }
    
    private loadData(domain:Domain , application:Application, pageIndex:number, pageSize:number){
          this.logger.debug(LOG_TAG, "loadData domain='" + domain+ "' application='"+application+"' pageIndex=", pageIndex, " pageSize=", pageSize);
    
          this.loading = true;

          let sort:MotifQuerySort = this.buildQuerySort();
                      
          let domainName = (domain?domain.name:null);
          let applicationName = (application?application.name:null);
          
          this.securityService.getSessions(null, null, domainName, applicationName, null, null, pageIndex, pageSize, 'response').subscribe((response)=>{
    
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
              
              this.loading = false;
    
          }, error=>{
            this.logger.error(LOG_TAG, "getRefreshTokenList failed: ", error);
            this.loading = false;
          });
      }
    
      public pageChange({ skip, take }: PageChangeEvent): void {
        this.logger.debug(LOG_TAG, "pageChange skip=", skip, " take=", take);
        this.skip = skip;
        this.pageSize = take;
        let newPageIndex = this.calculatePageIndex(skip, take);
        this.loadData(this._selectedDomain, this._selectedApplication, newPageIndex, this.pageSize);
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
        this.refreshApplicationsList();
        if (this._selectedDomain){
            this.logger.debug(LOG_TAG, "selectedDomain domain=", this._selectedDomain.name);
            this.loadData(this._selectedDomain, this._selectedApplication, 1, this.pageSize);
        } else {
            this.logger.debug(LOG_TAG, "selectedDomain domain=no selection");
            this.loadData(null, null, 1, this.pageSize);
        }
    }

     /**
     * Set the selcted domain
     */
    @Input()
    public set selectedApplication(application:Application){
        this._selectedApplication = application;
        this.loadData(this._selectedDomain,this._selectedApplication, 1, this.pageSize);
    }

  /**
   * Reload the list of the current sessions
   */
  public refreshData():void{
    this.logger.debug(LOG_TAG, "refreshData domain=", this._selectedDomain.name, " application=" + this._selectedApplication +" currentPage=", this.currentPage, " pageSize=", this.pageSize);
    this.loadData(this._selectedDomain, this._selectedApplication, this.currentPage, this.pageSize);
  }


    onDeleteOKPressed(dataItem:any):void {
        this.logger.debug(LOG_TAG, "onDeleteOKPressed dataItem=", dataItem);
        this.securityService.closeSession(dataItem.id).subscribe((data)=>{
            this.logger.debug(LOG_TAG, "onDeleteOKPressed OK:", data);
            this.showInfo("Session Delete", "Session deleted successfully.")
            this.refreshData();
        }, (error)=>{
            this.logger.error(LOG_TAG, "onDeleteOKPressed error:", error);
            this.showError("Session Delete Error", "Error during session deletion: " + error.error.Details + " [" + error.error.Code +"]");
        });
    }

   /**
     * Show Info Toast
     * @param title 
     * @param message 
     */
    private showInfo(title:string, message:string):void {
        this.toaster.info(message, title, {
            positionClass: 'toast-top-center'
        });
    }

    /**
     * Show Error Toast
     * @param title 
     * @param message 
     */
    private showError(title:string, message:string):void {
        this.toaster.error(message, title, {
            positionClass: 'toast-top-center'
        });
    }
}
