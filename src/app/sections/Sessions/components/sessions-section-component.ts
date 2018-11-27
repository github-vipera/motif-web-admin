import { Component, OnInit, ViewChild, Input, ElementRef, Renderer } from '@angular/core';
import { PluginView } from 'web-console-core'
import { NGXLogger} from 'web-console-core'
import { SecurityService } from '@wa-motif-open-api/security-service'
import { SessionRow } from '../data/model'
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { WCToasterService } from 'web-console-ui-kit'
import { SortDescriptor, orderBy } from '@progress/kendo-data-query'


const LOG_TAG = "[SessionsSection]";

@Component({
    selector: 'wa-sessions-section',
    styleUrls: [ './sessions-section.component.scss' ],
    templateUrl: './sessions-section.component.html'
  })
  @PluginView("Sessions",{
    iconName: "ico-configuration" 
  })
export class SessionsSectionComponent implements OnInit {

    private _data:any = [];
    public gridData: GridDataResult;
    public gridState: State = {
        skip: 0,
        take: 10
    };
    public sort:SortDescriptor[] = [];
    public sortOptions = { allowUnsort: 'true', mode: 'single' };

    constructor(private logger: NGXLogger, 
        private securityService:SecurityService,
        private toaster: WCToasterService,
        private renderer:Renderer){
        this.logger.debug(LOG_TAG ,"Opening...");
    } 
    
    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG ,"Initializing...");
        this.reloadSessionsList();
    }

    private reloadSessionsList():void {
        this.logger.debug(LOG_TAG ,"reloadSessionsList called...");
        this.securityService.getSessions().subscribe((data)=>{
            this.logger.debug(LOG_TAG ,"sessions: ", data);
            this.setData(data);
        }, (error)=>{
            this.logger.error(LOG_TAG ,"sessions error: ", error);
        });
    }
    
    /**
     * Triggered by the grid component
     * @param state 
     */
    public dataStateChange(state: DataStateChangeEvent): void {
        this.gridState = state;
        this.gridData = process(this._data, this.gridState);
    }

    /**
     * Set the local data and refresh the grid
     * @param data 
     */
    private setData(data:any):void {
        this._data = data;
        this.gridData = {
            data: orderBy(this._data, this.sort),
            total: this._data.length
        };
        //this.gridData = process(this._data, this.gridState);
    }

    private refreshData():void {
        this.setData(this._data);
    }

    /**
     * Triggered by the grid component
     * @param sort 
     */
    public sortChange(sort: SortDescriptor[]): void {
        this.logger.debug(LOG_TAG ,"sort change: ", sort);
        this.sort = sort;
        this.refreshData();
    }

}
