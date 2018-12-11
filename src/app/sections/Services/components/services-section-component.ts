import { Component, OnInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { PluginView } from 'web-console-core'
import { NGXLogger } from 'web-console-core'
import { RegistryService, PluginList, Plugin } from '@wa-motif-open-api/plugin-registry-service'
import { SortDescriptor, orderBy, GroupDescriptor, process, DataResult } from '@progress/kendo-data-query';
import { faGlobe, faArchive, faBoxOpen, faCompass, faDesktop } from '@fortawesome/free-solid-svg-icons';
import { DomainsService, Domain, ApplicationsService, ApplicationsList, Application } from '@wa-motif-open-api/platform-service'
import { WCPropertyEditorModel, WCPropertyEditorComponent, WCPropertyEditorItem, WCPropertyEditorItemType } from 'web-console-ui-kit'

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

    faGlobe = faGlobe;
    faBoxOpen = faBoxOpen;
    faArchive = faArchive;
    faCompass = faCompass;
    faDesktop = faDesktop;

    public gridData: DataResult;
    public gridView: DataResult;
    public sort: SortDescriptor[] = [];
    public groups: GroupDescriptor[] = [];

    public propertyModel:WCPropertyEditorModel = {
        items: [
          {
            name: "Description",
            field: "description",
            type: WCPropertyEditorItemType.String,
            value: "Vipera platform secure"
          },
          {
            name: "Offline",
            field: "offline",
            type: WCPropertyEditorItemType.Boolean,
            value: true
          },
          {
            name: "OTP expiry",
            field: "otpExpiry",
            type: WCPropertyEditorItemType.String,
            value: "-1"
          },
          {
            name: "Disabled Value",
            field: "disabledValue",
            type: WCPropertyEditorItemType.String,
            value: "this is disabled",
            disabled:true
          },
          {
            name: "Age",
            field: "age",
            type: WCPropertyEditorItemType.String,
            value: "45",
            htmlInputType: "number"
          },
          {
            name: "Car Type",
            field: "carType",
            type: WCPropertyEditorItemType.List,
            value: "BMW",
            listValues: ["Audi", "Mercedes", "Alfa Romeo", "BMW", "Mini Cooper"]
          }
    
        ]
      }

      
    public data = [
        { name: "login", description: "Login Operation", type: "Operation", channel: "JSON", domain: "Default", application: "Vipera", service: "Security" },
        { name: "logout", description: "Logout Operation", type: "Operation", channel: "REST", domain: "Default", application: "Vipera", service: "Security" },
        { name: "appcheck", description: "App Check Operation", type: "Operation", channel: "BROWSER", domain: "Default", application: "Vipera", service: "Utility" },
        { name: "pay", description: "HCE Pay Operation", type: "Operation", channel: "SMS", domain: "Bankart", application: "NLB Pay", service: "Payments" },
        { name: "transfer", description: "HCE Money Transfer Operation", type: "Operation", channel: "WEBADMIN", domain: "Bankart", application: "NLB Pay", service: "Payments" },
        { name: "transfer", description: "HCE Money Transfer Operation", type: "Operation", channel: "WEBCONTENT", domain: "Bankart", application: "NLB Pay", service: "Payments" }
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

    public onRowClicked(dataItem,event){
        console.log("onRowClicked:", dataItem);
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
