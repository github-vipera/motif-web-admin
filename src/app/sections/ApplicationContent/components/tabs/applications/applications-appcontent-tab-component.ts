import { Component, OnInit, Input} from '@angular/core';
import { NGXLogger} from 'web-console-core'
import { WCToasterService } from 'web-console-ui-kit'
import * as _ from 'lodash';
import { DomainsService, DomainsList, Domain } from '@wa-motif-open-api/platform-service'
import { EnginesService , Engine, EngineCreate, EngineList, EngineUpdate } from '@wa-motif-open-api/app-content-service'
import { DataResult } from '@progress/kendo-data-query';

const LOG_TAG = "[ApplicationsAppContentSection]";

@Component({
    selector: 'wa-appcontent-applications-tab',
    styleUrls: [ './applications-appcontent-tab-component.scss' ],
    templateUrl: './applications-appcontent-tab-component.html'
  })
export class ApplicationsTabComponent implements OnInit {
    
    public gridView: DataResult;
    public domainList: DomainsList = [];
    public _selectedDomain:Domain; //combo box selection
    public loading:boolean;

    constructor(private logger: NGXLogger, 
        private toaster: WCToasterService,
        private domainsService:DomainsService,
        private engineService:EnginesService
        ){
        this.logger.debug(LOG_TAG ,"Opening...");
        
    } 
    
    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG ,"Initializing...");
        this.refreshDomainList();
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

        /**
     * Set the selcted domain
     */
    @Input()
    public set selectedDomain(domain:Domain){
        this._selectedDomain = domain;
        if (this._selectedDomain){
            this.logger.debug(LOG_TAG, "selectedDomain domain=", this._selectedDomain.name);
            this.loadData(this._selectedDomain);
        } else {
            this.logger.debug(LOG_TAG, "selectedDomain domain=no selection");
        }
    }

    public loadData(domain:Domain):void {
        this.loading = true;
        this.engineService.getEngines(domain.name).subscribe((data)=>{
            this.logger.debug(LOG_TAG, "Engines for domain="+ domain.name+ ": ", data);
            this.gridView = {
                data: data,
                total: data.length
              }
            this.loading = false;
        }, (error)=>{
            this.logger.error(LOG_TAG, "Load Engines for domain="+ domain.name+ " error: ", error);
            this.showError("Get Applications", "Error getting applications: "+ error.error);
            this.loading = false;
        });
    }

    public refreshData(){
        if (this._selectedDomain){
            this.loadData(this._selectedDomain);
        }
    }

    public canRefresh():boolean {
        return (this._selectedDomain!=null);
    }

    public onRefreshClicked():void{
        this.refreshData();
    }
}
