import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { PluginView } from 'web-console-core'
import { NGXLogger} from 'web-console-core'
import { RegistryService, PluginList, Plugin } from '@wa-motif-open-api/plugin-registry-service'
import { SafeStyle } from '@angular/platform-browser';
import { process, State } from '@progress/kendo-data-query';

import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";

import {
    GridComponent,
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';
import * as _ from 'lodash';

const LOG_TAG = "[PluginsSection]";

@Component({
    selector: 'wa-log-section',
    styleUrls: [ './plugins-section-component.scss' ],
    templateUrl: './plugins-section-component.html'
  })
  @PluginView("Plugins",{
    iconName: "ico-plugins" 
})
export class PluginsSectionComponent implements OnInit {

    public data:PluginList;
    public gridData: GridDataResult;// = process(sampleProducts, this.state);
    public loading:boolean;
    private filterValue:string;

    public state: State = {
    };

    constructor(private logger: NGXLogger,
        private registryService:RegistryService){
        this.logger.debug(LOG_TAG ,"Opening...");

    } 
    
    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG ,"Initializing...");
    }

    public onRefreshClicked():void {
        this.logger.debug(LOG_TAG ,"Refresh clicked");
        this.refreshData();
    }

    public refreshData(){
        this.loading = true;
        this.registryService.getPlugins(true, 'REGISTERED').subscribe((data:PluginList)=>{
            this.data = data;
            this.displayData();
            this.displayData();
            this.loading = false;
            //console.log("refreshData: ", data);
        }, (error)=>{
            //console.error("refreshData error: ", error);
            this.gridData = process([], this.state);
            this.loading = false;
        });
    }

    public statusColorCode(plugin:Plugin):SafeStyle {
        if (plugin.status === 'ACTIVE'){
            return '#1ab31a'
        } else {
            return "inherit";
        }
    }

    public onFilterChange(event:Event){
        this.filterValue = event.srcElement.value; 
        this.displayData();
    }

    private displayData():void{
        let filteredData;
        if (this.filterValue){
            filteredData = _.filter(this.data,(o)=>{
                var matcher = new RegExp("." + this.filterValue + ".");
                return matcher.test(o.name);
            });
        } else {
            filteredData = this.data;
        }
        this.gridData = process(filteredData, this.state);
    }
}
