import { Component, OnInit, ViewChild} from '@angular/core';
import { NGXLogger} from 'web-console-core'
import * as _ from 'lodash';
import { DomainsService, DomainsList, Domain } from '@wa-motif-open-api/platform-service'
import { EnginesService , Engine, EngineCreate, EngineList, EngineUpdate } from '@wa-motif-open-api/app-content-service'
import { DataResult } from '@progress/kendo-data-query';
import { DomainSelectorComboBoxComponent } from '../../../../../components/UI/domain-selector-combobox-component'
import {ToasterUtilsService } from '../../../../../components/UI/toaster-utils-service'

const LOG_TAG = "[ApplicationsAppContentSection]";

@Component({
    selector: 'wa-appcontent-applications-tab',
    styleUrls: [ './applications-appcontent-tab-component.scss' ],
    templateUrl: './applications-appcontent-tab-component.html'
  })
export class ApplicationsTabComponent implements OnInit {
    
    public gridView: DataResult;
    public loading:boolean;

    @ViewChild ('domainSelector') domainSelector: DomainSelectorComboBoxComponent;

    constructor(private logger: NGXLogger, 
        private domainsService:DomainsService,
        private engineService:EnginesService,
        private toasterService:ToasterUtilsService
        ){
        this.logger.debug(LOG_TAG ,"Opening...");
    } 
    
    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG ,"Initializing...");
    }

    
    public onDomainSelected(domain:Domain){
        if (domain){
            this.loadData(domain);
        }  else {
            this.gridView = {
                data: [],
                total: 0
              }
        }
    }

    public loadData(domain:Domain):void {
        this.loading = true;
        this.engineService.getEngines(domain.name).subscribe((data)=>{
            this.logger.debug(LOG_TAG, "Engines for domain="+ domain.name+ ": ", data);

            data = _.forEach(data, function(element) {
                if (element.lastAppCheck){
                    element.lastAppCheck = new Date(element.lastAppCheck);
                }
                if (element.created){
                    element.created = new Date(element.created);
                }
            });

            this.gridView = {
                data: data,
                total: data.length
              }
            this.loading = false;
        }, (error)=>{
            this.logger.error(LOG_TAG, "Load Engines for domain="+ domain.name+ " error: ", error);
            this.toasterService.showError("Get Applications", "Error getting applications: "+ error.error);
            this.loading = false;
        });
    }

    public onDeleteOKPressed(mobileApplication:EngineCreate){
        alert("TODO!! remove app " + mobileApplication.name)
    }

    public refreshData(){
        if (this.domainSelector.selectedDomain){
            this.loadData(this.domainSelector.selectedDomain);
        }
    }

    public canRefresh():boolean {
        return (this.domainSelector.selectedDomain!=null);
    }

    public onRefreshClicked():void{
        this.refreshData();
    }
}
