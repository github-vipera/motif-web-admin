import { Component, OnInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { PluginView } from 'web-console-core'
import { NGXLogger } from 'web-console-core'
import { RegistryService, PluginList, Plugin } from '@wa-motif-open-api/plugin-registry-service'
import { SortDescriptor, orderBy, GroupDescriptor, process, DataResult } from '@progress/kendo-data-query';

import {
    GridComponent,
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';

import * as _ from 'lodash';
import { faLessThan } from '@fortawesome/free-solid-svg-icons';

const LOG_TAG = "[ServicesSection]";

@Component({
    selector: 'wa-services-section',
    styleUrls: ['./services-section-component.scss'],
    templateUrl: './services-section-component.html'
})
@PluginView("Services", {
    iconName: "ico-services"
})
export class ServicesSectionComponent implements OnInit {

    public gridData: DataResult;
    public gridView: DataResult;
    public sort: SortDescriptor[] = [];
    public groups: GroupDescriptor[] = [];

    public data = [
        { name: "login", description: "Login Operation", type: "Operation", channel: "JSON", domain: "Default", application: "Vipera", service: "Security" },
        { name: "logout", description: "Logout Operation", type: "Operation", channel: "JSON", domain: "Default", application: "Vipera", service: "Security" },
        { name: "appcheck", description: "App Check Operation", type: "Operation", channel: "JSON", domain: "Default", application: "Vipera", service: "Utility" },
        { name: "pay", description: "HCE Pay Operation", type: "Operation", channel: "JSON", domain: "Bankart", application: "NLB Pay", service: "Payments" }
    ]

    public loading: boolean;
    private _currentRowElement:any;

    constructor(private logger: NGXLogger,
        private registryService: RegistryService) {
        this.logger.debug(LOG_TAG, "Opening...");

    }

    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG, "Initializing...");
        this.groups = [{ field: 'domain' },{ field: 'application' },{ field: 'service' } ];

        this.gridView = process(this.data, { group: this.groups });
    }


    public onRefreshClicked(): void {
        this.logger.debug(LOG_TAG, "Refresh clicked");
        this.refreshData();
    }

    public refreshData() {
        this.loading = true;
        this.loading = false;
    }

    public cellClickHandler(event) {
        console.log("cellClickHandler: ", event)
    }

    public onDomainRowClicked(dataItem,event){
        console.log("onDomainRowClicked:", dataItem);
        this.doSelectCurrentRow(event.srcElement.closest('tr'));
    }   

    private doSelectCurrentRow(rowElement:ElementRef):void {
        if (this._currentRowElement){
            this.doUnselectRow(this._currentRowElement);
        }
        this._currentRowElement = rowElement; 
        this._currentRowElement.classList.add("k-state-selected");
        this._currentRowElement.attributes["role"] = "row";
    }

    private doUnselectRow(rowElement:ElementRef):void {
        this._currentRowElement.classList.remove("k-state-selected");
        this._currentRowElement.attributes["role"] = null;
    }

}
